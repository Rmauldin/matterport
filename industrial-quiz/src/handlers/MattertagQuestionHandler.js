import { Question, QuestionParseError } from "../models/Question";

export class MattertagQuestionHandler{

  constructor(){
    this.tagMap = {};
    this.questions = [];    
  }
  
  subscribe(sdk){
    this.sdk = sdk;
    this.sdk.Mattertag.data.subscribe(this);
  }
  
  setupQuestion(item){
    const question = new Question(item.description);
    this.questions.push(question);
    console.log(question);
    // const injectHTML = getTagHTML(match.groups);
  }

  getTagHTML(question){

  }

  injectTag(item, values){
    const inject = getInjectHTML(item);
  }

  isQuestionTag(item){
    return item.label.toLowerCase().includes('test question');
  }

  onAdded(index, item, collection){
    if(this.isQuestionTag(item)){
      try{
        this.setupQuestion(item);
      }catch(e){
        if(e instanceof QuestionParseError){
          console.error(e); 
        }else{
          throw e;
        }
      }
    }
  }
  
  onCollectionUpdated(collection){
    this.tagMap = collection;
  }
  
}