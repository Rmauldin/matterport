"use strict";

const key = "2d4dfb9fd6414902b663c25a6c767cfa"
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

async function loadQuestions(mpSdk){

    let questionsEle = document.querySelector('.questions');

    // Can also load questions from file or database
    const res = await fetch('assets/questions.json');
    const questions = await res.json();
    
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