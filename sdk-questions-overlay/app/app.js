"use strict";

const key = "fe2587b5509f46949a166ee38ec362b6";
const sid = "iL4RdJqi2yK";
const params = "&help=0&hl=0&play=1&qs=1&brand=0";
var iframe;

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.querySelector('.showcase');
    iframe.setAttribute('src', `https://my.matterport.com/show/?m=${sid}${params}`);
    iframe.addEventListener('load', showcaseLoader);

    let overlay = document.querySelector('.right-overlay');
    let title = document.querySelector('.overlay-title');
    let tags = document.querySelector('.nearby-tags');
    tags.style.display = 'none';
    let arrow = overlay.querySelector('.overlay-arrow');
    title.addEventListener('click', () => {
        tags.style.display = tags.style.display === 'flex' ? 'none' : 'flex';
        arrow.classList.toggle('active');
    });

});

function showcaseLoader(){
    try {
        window.MP_SDK.connect(iframe, key, '3.2')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    }
    catch (e) {
        console.error(e);
    }
}

function euclideanDistance3D(pos1, pos2){
    return Math.sqrt( 
        Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2) +
        Math.pow(pos1.z - pos2.z, 2)
     );
}

function removeElementsInside(ele){
    while(ele.firstChild){
        ele.removeChild(ele.lastChild);
    }
}

function loadedShowcaseHandler(mpSdk){
    // Initial setup
    removeAllTags();
    let questions = loadQuestions();
    let sweeps = getModelSweeps()
    let mattertags = questions.map(question => question.tag);
    let sortFunc = (a, b) => a.distance - b.distance;
    
    mattertags.forEach(tag => tag.discPosition = mpSdk.Mattertag.getDiscPosition(tag));

    let cursweep;

    setTimeout(() => {
        cursweep = Object.keys(sweeps)[0];
        updateNearbyTags(cursweep);
    }, 3000);

    // Listeners
    mpSdk.on(mpSdk.Sweep.Event.ENTER, (oldSweep, newSweep) => {
        cursweep = newSweep;
        updateNearbyTags(newSweep);
    });

    mpSdk.on(mpSdk.Mattertag.Event.HOVER, (sid, hovering) => {
        let existing_overlay = document.querySelector('.popup-overlay');
        if(existing_overlay) existing_overlay.remove();
        popupQuestion(sid);
    });

    // Functions
    function createTagElements(tags, container){
        tags.forEach(tag => {
            let question = getQuestion(tag.sid);
    
            let tagEle = document.createElement("div");
            tagEle.setAttribute('class', 'tag-info');
            tagEle.setAttribute('id', tag.sid);
    
            let arrow = document.createElement("div");
            arrow.setAttribute('id', 'arrow');
            tagEle.insertAdjacentElement('beforeend', arrow);
    
            let title = document.createElement("p");
            title.setAttribute('id', 'title');
            title.innerText = tag.label + ` (${tag.distance.toPrecision(2)}m away)`;
            tagEle.insertAdjacentElement('beforeend', title);
    
            let goto = document.createElement("p");
            goto.setAttribute('id', 'goto');
            if(question.hasOwnProperty("element") && question.element.querySelector('.popup-status').innerText !== "Unanswered"){
                goto.innerText = "Answered";
            }else{
                goto.innerText = "Answer Question";
            }
            // goto.innerText = question.hasOwnProperty("element") ? "Answered" : "Answer Question";
            tagEle.insertAdjacentElement('beforeend', goto);
    
            let description = document.createElement("p");
            description.setAttribute('id', 'description');
            description.innerText = question.tag ? question.tag.description : tag.description;
            description.style.display = 'none';
            tagEle.insertAdjacentElement('beforeend', description);
    
            container.insertAdjacentElement('beforeend', tagEle);
        });
        return container;
    }

    function getTagProximity(sweepID){
        let sameLevelTags = [];
        let newSweep = sweeps[sweepID];
        mattertags.forEach(tag => tag.distance = euclideanDistance3D(tag.discPosition, newSweep.position));
        // sameLevelTags = mattertags.filter(tag => Math.abs(tag.discPosition.y - newSweep.position.y) <= 2.25);
        sameLevelTags = mattertags;
        sameLevelTags.sort(sortFunc);
        // return sameLevelTags.length >= 5 ? sameLevelTags.slice(0, 4) : sameLevelTags;
        return sameLevelTags
    }

    function updateNearbyTags(sweepID){
        let sameLevelTags = getTagProximity(sweepID);
        let container = document.querySelector('.nearby-tags');
        removeElementsInside(container);
        let ele = createTagElements(sameLevelTags, container);
        setTagListeners(ele);
    }

    function getModelSweeps(){
        let sweeps = [];
        mpSdk.Model.getData()
        .then(data => {
            data.sweeps.forEach(sweep => {
                sweeps[sweep.uuid] = sweep;
            });
        })
        .catch(console.error);
        return sweeps;
    }

    function getQuestion(tagID){
        return questions.filter(question => question.tag.sid == tagID)[0];
    }

    function createQuestionElement(question){
        // Container
        let container = document.createElement('div');
        container.setAttribute('class', 'popup-overlay');

        // Exit
        let exit = document.createElement('div');
        exit.setAttribute('class', 'popup-exit');
        exit.innerText = "X";
        container.insertAdjacentElement('beforeend', exit);

        // Title
        let title = document.createElement('h3');
        title.setAttribute('class', 'popup-title');
        title.innerText = question.title;
        container.insertAdjacentElement('beforeend', title);

        // Question status
        let status = document.createElement('h4');
        status.setAttribute('class', 'popup-status');
        status.innerText = "Unanswered";
        container.insertAdjacentElement('beforeend', status);

        // Choices
        let description = document.createElement('ul');
        description.setAttribute('class', 'choices');
        question.choices.forEach((choice, i) => {
            // List item
            let li = document.createElement('li');

            // Label
            let label = document.createElement('label');
            label.setAttribute('for', `${i}`);
            label.innerText = choice;

            // Radio button
            let choiceBtn = document.createElement('input');
            choiceBtn.setAttribute('type', 'radio');
            choiceBtn.setAttribute('id', `${i}`);
            choiceBtn.setAttribute('value', `${i}`);
            choiceBtn.setAttribute('name', 'choice');

            li.insertAdjacentElement('beforeend', choiceBtn);
            li.insertAdjacentElement('beforeend', label);
            description.insertAdjacentElement('beforeend', li);
        });
        container.insertAdjacentElement('beforeend', description);

        return container;
    }

    function setPopupListeners(questionEle, question){
        let choices = questionEle.querySelectorAll('input');
        let status = questionEle.querySelector('.popup-status');
        let exit = questionEle.querySelector('.popup-exit');
        exit.addEventListener('click', e => {
            questionEle.remove();
        });

        choices.forEach(choice => {
            choice.addEventListener('change', newVal => {
                // TODO: propogate to right overlay
                if(newVal.target.value === question.answer){
                    status.innerText = "Correct!";
                    status.style.color = "rgb(103, 255, 103)";
                    question.tag.color = {r: 0, g: 1, b: 0};
                    mpSdk.Mattertag.editColor(question.tag.sid, {r: 0, g: 1, b: 0})
                    .catch(console.error);
                }else{
                    status.innerText = "Incorrect";
                    status.style.color = "rgb(255, 103, 103)";
                    question.tag.color = {r: 1, g: 0, b: 0};
                    mpSdk.Mattertag.editColor(question.tag.sid, {r: 1, g: 0, b: 0})
                    .catch(console.error);
                }
                mpSdk.Mattertag.editBillboard(question.tag.sid, {
                    description: status.innerText
                })
                .catch(console.error);
                question.tag.description = status.innerText;
                updateNearbyTags(cursweep);
            });
        });
    }

    function popupQuestion(tagID){
        let question = getQuestion(tagID);
        let questionEle;
        if(question.hasOwnProperty("element")){
            questionEle = question.element;
        }else{
            questionEle = createQuestionElement(question);
            setPopupListeners(questionEle, question);
            question.element = questionEle;
        }
        iframe.insertAdjacentElement('beforebegin', questionEle);
    }

    function setTagListeners(container){

        container.childNodes.forEach(tagEle =>{

            let goto = tagEle.querySelector('#goto');
            goto.addEventListener('click', e => {
                let existing_overlay = document.querySelector('.popup-overlay');
                if(existing_overlay) existing_overlay.remove();
                mpSdk.Mattertag.navigateToTag(tagEle.id, mpSdk.Mattertag.Transition.FADE)
                .catch(console.error);
                popupQuestion(tagEle.id);
            });

            let description = tagEle.querySelector('#description');
            let arrow = tagEle.querySelector('#arrow');

            let title = tagEle.querySelector('#title');
            title.addEventListener('click', e => {
                description.style.display = description.style.display === 'inherit' ? 'none' : 'inherit';
                arrow.classList.toggle('active');
            });

        });
    }

    function removeAllTags(){
        mpSdk.Mattertag.getData()
        .then(tags => {
            return tags.map(tag => tag.sid);
        })
        .then(tagSids => {
            return mpSdk.Mattertag.remove(tagSids)
        })
        .catch(console.error);
    }

    function createMattertag(question){
        mpSdk.Mattertag.add(question.tag)
        .then(sid => {
            question.tag.sid = sid[0];
        })
        .catch(console.error);
    }

    function loadQuestions(){
        let questions = [
            {
                "title": "What brand is the fridge?",
                "description": null,
                "answer": "1",
                "choices": ["GE", "Sub-Zero", "Kenmore", "LG"],
                "tag": {
                    "sid": "aUMYG5cfYMm",
                    "label": "What brand is the fridge?",
                    "description": "",
                    "parsedDescription": [],
                    "mediaSrc": "",
                    "mediaType": "none",
                    "media": {
                        "type": "none",
                        "src": ""
                    },
                    "anchorPosition": {
                        "x": 5.314893167599408,
                        "y": -0.1567343140995423,
                        "z": 10.455523925678921
                    },
                    "anchorNormal": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 1
                    },
                    "enabled": true,
                    "stemVector": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "stemVisible": true
                }
            },
            {
                "title": "How wide is the TV?",
                "description": null,
                "answer": "2",
                "choices": ["10'", "3'2''", "6'5''", "1'"],
                "tag": {
                    "sid": "hDZVtcsGd5t",
                    "label": "How wide is the TV?",
                    "description": "",
                    "parsedDescription": [],
                    "mediaSrc": "",
                    "mediaType": "none",
                    "media": {
                        "type": "none",
                        "src": ""
                    },
                    "anchorPosition": {
                        "x": 6.808068364327917,
                        "y": -0.7514079923325638,
                        "z": 1.2463780759085934
                    },
                    "anchorNormal": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 1
                    },
                    "enabled": true,
                    "stemVector": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "stemVisible": true
                }
            },
            {
                "title": "What is the recommended procedure with a table during an earthquake?",
                "description": null,
                "answer": "2",
                "choices": ["Get on top of the table", "Move the table outside", "Get under the table", "Get under a chandelier"],
                "tag" : {
                    "sid": "ehDVQ3HF1al",
                    "label": "What is the recommended procedure with a table during an earthquake?",
                    "description": "",
                    "parsedDescription": [],
                    "mediaSrc": "",
                    "mediaType": "none",
                    "media": {
                        "type": "none",
                        "src": ""
                    },
                    "anchorPosition": {
                        "x": 0.4731829189866753,
                        "y": -0.8998377744732301,
                        "z": 5.968713694470143
                    },
                    "anchorNormal": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 1
                    },
                    "enabled": true,
                    "stemVector": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "stemVisible": true
                }
            },
            {
                "title": "Who should you call in an emergency?",
                "description": null,
                "answer": "0",
                "choices": ["911", "Ghostbusters", "Grandma", "Matterport Customer Support"],
                "tag": {
                    "sid": "kMF3VzNIslo",
                    "label": "Who should you call in an emergency?",
                    "description": "",
                    "parsedDescription": [],
                    "mediaSrc": "",
                    "mediaType": "none",
                    "media": {
                        "type": "none",
                        "src": ""
                    },
                    "anchorPosition": {
                        "x": 5.015846850857473,
                        "y": -0.8528928246952776,
                        "z": 7.197700847992113
                    },
                    "anchorNormal": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 1
                    },
                    "enabled": true,
                    "stemVector": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "stemVisible": true
                }
            },
            {
                "title": "What color is this chair?",
                "description": null,
                "answer": "0",
                "choices": ["Red", "Blue", "Yellow", "Green"],
                "tag": {
                    "sid": "DsYfDW00lSB",
                    "label": "What color is this chair?",
                    "description": "",
                    "parsedDescription": [],
                    "mediaSrc": "",
                    "mediaType": "none",
                    "media": {
                        "type": "none",
                        "src": ""
                    },
                    "anchorPosition": {
                        "x": 5.8739787740590685,
                        "y": 2.1396123213050684,
                        "z": 8.299051556795263
                    },
                    "anchorNormal": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 1
                    },
                    "enabled": true,
                    "stemVector": {
                        "x": 0,
                        "y": 0.2,
                        "z": 0
                    },
                    "stemVisible": true
                }
            }
        ];
        questions.forEach(question => {
            createMattertag(question);
        });
        return questions;
    }
}
