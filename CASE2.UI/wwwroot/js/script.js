let questions = [];
let currentQuestionIndex = 0;
let answers = [];
const questionDisplayTime = 30000;
const enableOptionsTime = 10000;

document.addEventListener('DOMContentLoaded', async () => {
    questions = await fetchQuestions();
    startQuiz();
});

async function fetchQuestions() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.slice(0, 10).map((item, index) => ({
        question: item.title,
        options: generateOptions(item.body),
        correctAnswer: 'A', // Simulate correct answer (can be improved)
    }));
}

function generateOptions(body) {
    const words = body.split(' ');
    return [
        'A: ' + (words[0] || 'Option 1'),
        'B: ' + (words[1] || 'Option 2'),
        'C: ' + (words[2] || 'Option 3'),
        'D: ' + (words[3] || 'Option 4')
    ];
}

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        document.getElementById('question').textContent = questionData.question;
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach((button, index) => {
            button.textContent = questionData.options[index];
            button.disabled = true;
            button.classList.remove('enabled');
            button.onclick = () => recordAnswer(questionData.options[index]);
        });

        setTimeout(() => {
            optionButtons.forEach(button => {
                button.disabled = false;
                button.classList.add('enabled');
            });
        }, enableOptionsTime);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        }, questionDisplayTime);
    }
}

function recordAnswer(answer) {
    answers.push({
        question: questions[currentQuestionIndex].question,
        answer: answer
    });
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const resultTableBody = document.querySelector('#result-table tbody');

    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    answers.forEach((answer, index) => {
        const row = resultTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = answer.question;
        cell2.textContent = answer.answer;
    });
}
