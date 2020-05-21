"use strict";

const key = "2d4dfb9fd6414902b663c25a6c767cfa";
const sid = "iL4RdJqi2yK";
const params = "&hr=0&play=1&qs=1";

document.addEventListener("DOMContentLoaded", () => {
    let iframe = document.querySelector('.showcase');
    iframe.setAttribute('src', `https://my.matterport.com/show/?m=${sid}${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
});

function createMattertag(question, mpSdk){
    mpSdk.Mattertag.add(question.tag)
    .then(sid => {
        question.tag.sid = sid[0];
    })
    .catch(console.error);
}

function createQuestionElement(question){
    let choices = question.choices;

    // Create question container
    let questionElement = document.createElement("div");
    questionElement.setAttribute('class', 'question');
    questionElement.classList.add("unselected");

    // Create title
    let title = document.createElement("h3");
    title.setAttribute('class', 'question_title')
    title.innerText = question.title;
    questionElement.insertAdjacentElement("beforeend", title);

    // Create form wrapper
    let form = document.createElement('form');
    questionElement.insertAdjacentElement("beforeend", form);

    // Create choice wrapper
    let choice_list = document.createElement("ul");
    choice_list.setAttribute('class', 'choices');
    form.insertAdjacentElement("beforeend", choice_list);

    // Create choices
    choices.forEach( (choice, i) => {
        let item = document.createElement('li');
        item.setAttribute('class', 'choice');

        // radio button
        let btn = document.createElement("input")
        btn.setAttribute('type', 'radio');
        btn.setAttribute('id', i)
        btn.setAttribute('name', 'choice');
        btn.setAttribute('value', i);
        
        // label
        let label = document.createElement('label');
        label.setAttribute('for', `${i}`);
        label.innerText = choice

        item.insertAdjacentElement("beforeend", btn)
        item.insertAdjacentElement("beforeend", label)
        choice_list.insertAdjacentElement("beforeend", item)
    });

    // Go To button
    let goToBtn = document.createElement('button');
    goToBtn.setAttribute('class', 'goto_button');
    goToBtn.innerText = "Go to Mattertag"
    questionElement.insertAdjacentElement("beforeend", goToBtn);

    return questionElement
}

function updateTagColor(tag, newColor, mpSdk){
    if(!tag) return;
    if(tag.hasOwnProperty('color')){
        tag.color = newColor;
    }
    mpSdk.Mattertag.editColor(tag.sid, newColor)
    .catch(console.error);
}

function updateTagDescription(tag, newDescription, mpSdk){
    if(!tag) return;
    if(tag.hasOwnProperty('description')){
        tag.description = newDescription;
    }
    mpSdk.Mattertag.editBillboard(tag.sid, {description: newDescription} )
    .catch(console.error);
}

function giveQuestionListeners(question, questionElement, mpSdk){

    questionElement.addEventListener('click', e => {
        let q = document.querySelector('.selected');
        if(q){
            q.classList.replace('selected', 'unselected');
        }
        questionElement.classList.replace('unselected', 'selected');
    });

    let choices = questionElement.querySelectorAll('.choice');

    choices.forEach(li => {
        let inp = li.children[0];
        inp.addEventListener('change', newVal => {
            let ans = document.createElement("h4");
            if(newVal.target.id === question.answer){
                ans.setAttribute("style", "color: rgb(9, 179, 9); font-style: italic;");
                ans.innerText = "Correct";
                updateTagColor(question.tag, {r: 0, g: 1, b: 0}, mpSdk);
            }else{
                ans.setAttribute("style", "color: rgb(179, 9, 9); font-style: italic;");
                ans.innerText = "Incorrect";
                updateTagColor(question.tag, {r: 1, g: 0, b: 0}, mpSdk);
            }
            updateTagDescription(question.tag, ans.innerText, mpSdk);
            if(questionElement.children[0].tagName === "H4"){
                questionElement.removeChild(questionElement.children[0]);
            }
            questionElement.insertAdjacentElement("afterbegin", ans);
        });
    });

    let goto = questionElement.querySelector('.goto_button');
    goto.addEventListener('click', () => {
        mpSdk.Mattertag.navigateToTag(question.tag.sid, mpSdk.Mattertag.Transition.FADEOUT)
        .catch(console.error);
    });

}

function loadQuestions(mpSdk){

    let questionsEle = document.querySelector('.questions');

    // Can also load questions from file or database
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
        createMattertag(question, mpSdk);
        let questionEle = createQuestionElement(question);
        questionsEle.insertAdjacentElement("beforeend", questionEle);
        giveQuestionListeners(question, questionEle, mpSdk);
    });
}

function showcaseLoader(iframe){
    try{
        window.MP_SDK.connect(iframe, key, '3.2')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

function loadedShowcaseHandler(mpSdk){
    // Remove existing mattertags
    mpSdk.Mattertag.getData()
    .then(tags => {
        return tags.map(tag => tag.sid);
    })
    .then(tagSids => {
        return mpSdk.Mattertag.remove(tagSids)
    })
    .catch(console.error);

    // Load questions and tags
    loadQuestions(mpSdk);
}