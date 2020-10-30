const appState = {
    name : '',
    quiz_num : '',
    right: 0,
    total: 16,
    question_num: 0,
}

document.addEventListener('DOMContentLoaded', function(){

    load_view('#begin', '#view-widget');


    document.querySelector('#quiz-select').onclick = function()
    {
        appState.name = document.querySelector('#name').value;
        let temp = document.getElementsByName('quiz')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                appState.quiz_num = temp[i].value;
            }
        }

        load_quiz();

    }
})

function load_quiz()
{
    let vars = {
        right: appState.right,
        total: appState.total
    }
    load_view('#quiz-view', '#view-widget', vars)
    load_question();
}

async function load_question()
{
    if (appState.question_num === appState.total)
    {
        finish_quiz();
    }
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);
    if (question["Type"] === "MC")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
            choice1: question["Choice1"],
            choice2: question["Choice2"],
            choice3: question["Choice3"]
        }
        load_view('#mc-question', '#question-view', vars)
    }
    else if (question["Type"] === "Fill-In")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
        }
        load_view('#fill-in-question', '#question-view', vars)
    }
    else if (question["Type"] === "True-False")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"]
        }
        load_view('#true-false-question', '#question-view', vars)
    }
}


async function check_answer(q_type)
{
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);

    if (q_type === 'MC')
    {
        var answer;
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                 answer = temp[i].value;
            }
        }
        if (answer === question["Answer"])
        {
            right();
        }
        else
        {
            wrong();
        }
    }
    else if (q_type === 'True-False')
    {
        var answer;
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                answer = temp[i].value;
            }
        }
        if (answer === question["Answer"])
        {
            right();
        }
        else
        {
            wrong();
        }
    }
    else if (q_type === 'Fill-In')
    {
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

    function right()
    {
        load_view('#right', '#result');
        appState.right++;
        appState.question_num++;
        setTimeout(load_quiz, 1000);
    }
    function wrong()
    {
        let vars = {
            explanation: question['Explanation']
        }
        appState.question_num++;
        load_view('#explanation', '#result', vars);
    }
}


function finish_quiz()
{
    var score = (appState.right/appState.total).toFixed(1) * 100;
    let vars = {
        name : appState.name,
        right: appState.right,
        total: appState.total,
        score: score + '%'
    }
    if(appState.right >= appState.total * 0.8)
    {
        load_view('#passed', '#view-widget', vars);
    }
    else
    {
        load_view('#failed', '#view-widget', vars);
    }
}

async function get_quiz_info(quiz_num, question_num)
{
    try {
        const response = await fetch('https://my-json-server.typicode.com/sharandeepkaur99/Assignment-4' + quiz_num);
        const result = await response.json();
        return result[question_num];
    }catch(err)
    {
        console.log("Error");
    }

}

function load_view(target, replace, vars)
{
    var source = document.querySelector(target).innerHTML;
    var template = Handlebars.compile(source);
    var html = template(vars);
    document.querySelector(replace).innerHTML = html;
}
