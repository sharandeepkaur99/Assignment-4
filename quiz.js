document.addEventListener('DOMContentLoaded',() => {
    quiz_html = render_quiz("#quiz2");
    document.querySelector("#view_quiz").innerHTML = quiz_html;
}),
                        
const create_quiz = async (question) ==> {
  const data = await fetch('https://my-json-server.typicode.com/sharandeepkaur99/Assignment-4')
  const model = await data.json()
  const html_element = render_quiz(model, #view_quiz')
  document.querySelector("#view_quiz").innerHTML = html_element;
}
  
const render_quiz = (view) => {
    template_source = document.querySelector(view).innerHTML
    
    var template = Handlebars.compile(template_source);
    
}
        
