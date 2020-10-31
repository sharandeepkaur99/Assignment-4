const appState = {
    name : '',
    quiz_num : '',
    right: 0,
    total: 15,
    question_num: 1,
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#quiz_select").onsubmit = (e) => {
        handle_form(e)
    }
  

  document.querySelector("#app_widget").onclick = (e) => {
      handle_vote(e)
  }
});


const handle_form = (e) => {
    var name = document.querySelector("#name").value;
    var quiz_selection = document.querySelector("#quiz-select").value;
    alert('Hello' + name + "you picked" + quiz-select);
    if (quiz_select == "quiz_1"){
        load_question()
    }
    else if (quiz_select == "quiz_2"){
        load_question()
    }

}
const handle_vote = (e) => {
    console.log(e.target)
    if (e.target.dataset.vote == "true"){
        appState.current_correct +=1 
        load_question()
    } else if (e.target.dataset.vote == "false"){ 
        appState.current_wrong +=1
        load_question()()
    }

    if (appState.current_correct=10){
        alert("10 correct, Restart")
        appState.current_correct = 0;
        appState.current_wrong = 0;
    }
    
}

function quiz_status(){
    let vars = {
        right: appState.right,
        total: appState.total
    }
    load_view('#quiz-view', '#view-widget', vars)
    load_question();
}

async function load_question(){
    if (appState.question_num === appState.total){
        finish_quiz();
    }
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);
    if (question["Type"] === "MC"){
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
            choice1: question["Choice1"],
            choice2: question["Choice2"],
            choice3: question["Choice3"]
        }
        load_view('#mc-question', '#question-view', vars)
    }
    else if (question["Type"] === "Fill-In"){
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
        }
        load_view('#fill-in-question', '#question-view', vars)
    }
    else if (question["Type"] === "True-False"){
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"]
        }
        load_view('#true-false-question', '#question-view', vars)
    }
}


async function check_answer(q_type){
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);

    if (q_type === 'MC'){
        var answer;
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                 answer = temp[i].value;
            }
        }
        if (answer === question["Answer"]){
            right();
        }
        else{
            wrong();
        }
    }
    else if (q_type === 'True-False'){
        var answer;
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                answer = temp[i].value;
            }
        }
        if (answer === question["Answer"]){
            right();
        }
        else
        {
            wrong();
        }
    }
    else if (q_type === 'Fill-In'){
        let user_answer = document.querySelector('#answer').value;
        if (user_answer.toUpperCase() === question["Answer"].toUpperCase())
        {
            right();
        }
        else
        {
            wrong();
        }
    }

    function right(){
        load_view('#right', '#result');
        appState.right++;
        appState.question_num++;
        setTimeout(quiz_status, 1000);
    }
    function wrong(){
        let vars = {
            explanation: question['Explanation']
        }
        appState.question_num++;
        load_view('#explanation', '#result', vars);
    }
}


function finish_quiz(){
    var score = (appState.right/appState.total).toFixed(1) * 100;
    let vars = {
        name : appState.name,
        right: appState.right,
        total: appState.total,
        score: score + '%'
    }
    if(appState.right >= appState.total * 0.8){
        load_view('#pass', '#view-widget', vars);
    }
    else{
        load_view('#fail', '#view-widget', vars);
    }
}

async function get_quiz_info(quiz_num, question_num){
    try {
        const response = await fetch('https://my-json-server.typicode.com/sharandeepkaur99/Assignment-4/Quiz1' + quiz_num);
        const result = await response.json();
        return result[question_num];
    }catch(err)
    {
        console.log("Error");
    }

}

function load_view(target, replace, vars){
    var source = document.querySelector(target).innerHTML;
    var template = Handlebars.compile(source);
    var html = template(vars);
    document.querySelector(replace).innerHTML = html;
}
