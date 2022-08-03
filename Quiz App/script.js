//! Selectors 

let bulletsContainers = document.querySelector(".bullets .spans")
let bullets = document.querySelector(".bullets")
let questionsCount = document.querySelector('.counter span')
let quizBodyQuestion = document.querySelector(".quiz-body .question")
let quizBodyanswers = document.querySelector(".quiz-body .answers")
let submitBtn = document.querySelector(".sumbit button")
let timer = document.querySelector(".timer")
let res = document.querySelector(".result")
//! OPtions 
let questionCurrent = 0 ; 
let right_answer = 0 ;
let wrongAnswer = 0 ;
let currentInterval ;
//! Function Get Questions 
const getQuestions = ()=>{
    let request = new XMLHttpRequest();

    request.open("GET","questions.json",true)

    request.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200 ) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsLength = questionsObject.length ;
            createBullets(questionsLength);
            addData(questionsObject[questionCurrent],questionsLength);
            countDown(5 , questionsLength)
            let rightAnswer = questionsObject[questionCurrent].right_answer ;
            submitBtn.addEventListener('click' , ()=> {
                questionCurrent++;
                checkAnswer(rightAnswer , questionsLength)
                quizBodyanswers.innerHTML ="";
                quizBodyQuestion.innerHTML ="";
                addData(questionsObject[questionCurrent],questionsLength);
                handleBullets(questionCurrent)
                clearInterval(currentInterval)
                countDown(5 , questionsLength)
                showResult(questionsLength)
            })
        }
    }

    request.send()
}


//! Function of Create bullets 
const createBullets = (nums)=>{
    questionsCount.innerHTML = nums

    for (let i = 0; i < nums; i++) {
        let bullets = document.createElement('span') ; 
        bulletsContainers.appendChild(bullets)   

        if(i === 0) {
            bullets.className ="active"
        }
    }
}


//! Function Add Data 
const addData = (obj,nums)=> {
    if(questionCurrent <  nums) {
        let question = document.createElement("h2")
    question.textContent = obj["title"];

    quizBodyQuestion.appendChild(question)


    for(let i = 1 ; i <= 4 ; i++) {
        let answer = document.createElement('div')
        answer.className ="answer"; 
        let input  = document.createElement("input");
        input.type = "radio"
        input.name = "questions"
        input.id   = `answer${i}`
        input.dataset.answer = obj.answers[`answer${i}`]

        if(i === 1 ) {
            input.checked = true;
        }
        

        let label = document.createElement("label")
        label.htmlFor = `answer${i}`
        let text = document.createTextNode(obj.answers[`answer${i}`])
        label.appendChild(text)


        answer.appendChild(input)
        answer.appendChild(label)

        quizBodyanswers.appendChild(answer)

    }
    res.style.display ="none"
    }else{
        res.style.display = "block"
    }
    
}


//! check Answer
const checkAnswer = (rightAnswer , count)=>{
    
    if(questionCurrent < count) {
        let answers = document.getElementsByName("questions")
        let chosen ;
        for(let i = 0 ; i < answers.length ; i++) {
            if(answers[i].checked) {
                chosen = answers[i].dataset.answer;
            }
        }

        if(chosen ==rightAnswer) {
            right_answer++;
        }else{
            wrongAnswer++;
        }

    }
 
    
}

//! Handle Bullets
const handleBullets = (currentIndex)=>{
    let bulletsContainerSpans = document.querySelectorAll(".bullets .spans span")
    let spanArr = Array.from(bulletsContainerSpans);
    spanArr.forEach((span , index)=> {
        if(currentIndex === index) {
            span.classList.add("active");
        }
    })
}

//! Show Result
function showResult (count) {
    let result = "" ;
    if(questionCurrent === count) {
        submitBtn.remove()
        bulletsContainers.remove()
        quizBodyQuestion.remove()
        quizBodyanswers.remove()
        bullets.remove()
        timer.remove()
        if((right_answer - wrongAnswer)<5) {
            result += `<span class="bad">Bad</span> you Answered <span class="bad">${right_answer}</span> of ${count}`
        }else if((right_answer - wrongAnswer)>= 5 && (right_answer - wrongAnswer)< 9) {
            result += `<span class="good">Good</span> you Answered <span class="good">${right_answer}</span> of ${count}`
        }else{
            result += `<span class="perfect">Perfect</span> you Answered <span class="perfect">${right_answer}</span> of ${count}`
        }
        document.querySelector(".result").innerHTML = result;
    }
    
    
}

//! Count down function 
function countDown(duration , count) {
    if(questionCurrent < count) {
        let minutes , seconds , result ;
        currentInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}`: minutes ; 
            seconds = seconds < 10 ? `0${seconds}`: seconds ;
            result = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`
            timer.innerHTML = result ;
            if(--duration < 0) {
                clearInterval(currentInterval)
                submitBtn.click()
            }
        },1000)
    }
}

getQuestions()