export class QuestionParseError extends Error{
  constructor(message, ...params){
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
    this.name = 'QuestionParseError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

export const StatusEnum = {
    unanswered: 0,
    correct: 1,
    incorrect: 2
}

export class Question{
    
    constructor(raw_description){
        this.questionRegex = /^\s*(?<number>\d+)\.?\)?\s*(?<prompt>.+)\n*\r*\s*(?<options>(?:\s*\w+\.?.+\n*){4})(?<answer>.+)\n?$/m;
        // this.questionRegex = /^\s*(?<number>\d+)\.?\)?\s*(?<prompt>.+)\n*\r*\s*(?<options>(?:\s*\w+\.?.+\n*){4})answer (?<answer>\w)\s*\n*(?<source>.+)\s*\n?$/m;
        const match = raw_description.match(this.questionRegex);
        if(!match)
            throw new QuestionParseError(`${item.sid} question tag invalid format`);
        let groups = match.groups;
        this.number = groups.number;
        this.prompt = groups.prompt;
        this.options = this.extractOptions(groups.options);
        // this.answer = groups.answer.slice(-1).charCodeAt(0) - 97;
        this.answer = groups.answer;
        this.source = groups.source;
        this.status = StatusEnum.unanswered;
    }

    extractOptions(raw_options){
      const optionsRegex = /^\w\.\s*(?<option>.+)$/gm;
      return [...raw_options.matchAll(optionsRegex)].map(match => match.groups.option);
    }

}