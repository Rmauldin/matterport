"use strict";

const key = "2d4dfb9fd6414902b663c25a6c767cfa";
const sid = "iL4RdJqi2yK";
const params = "&help=0&hr=0&play=1&qs=1&brand=0";
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

    async function loadQuestions(){
        // Can also load questions from file or database
        let res = await fetch('assets/questions.json');
        const questions = await res.json();

        questions.forEach(question => {
            createMattertag(question);
        });
        return questions;
    }
}
