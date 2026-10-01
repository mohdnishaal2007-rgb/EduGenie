/* =========================================
   EDU GENIE - MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   DOM ELEMENTS
   ========================================= */

const task = document.getElementById("task");
const levelWrap = document.getElementById("levelWrap");
const inputText = document.getElementById("inputText");
const inputLabel = document.getElementById("inputLabel");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resultCard = document.getElementById("resultCard");
const result = document.getElementById("result");
const resultType = document.getElementById("resultType");
const statusBadge = document.getElementById("statusBadge");

const modeCards = document.querySelectorAll(".mode-card");

const workspaceTitle =
  document.getElementById("workspaceTitle");

const workspaceDescription =
  document.getElementById("workspaceDescription");

const themeBtn =
  document.getElementById("themeBtn");

const copyBtn =
  document.getElementById("copyBtn");

const regenerateBtn =
  document.getElementById("regenerateBtn");

const charCount =
  document.getElementById("charCount");

const suggestions =
  document.querySelectorAll(".suggestion");

const clearHistoryBtn =
  document.getElementById("clearHistoryBtn");

const recentActivity =
  document.getElementById("recentActivity");


/* =========================================
   TASK INFORMATION
   ========================================= */

const labels = {

  qa: [
    "Your question",
    "For example: Which is the largest ocean?",
    "Answer Question"
  ],

  explain: [
    "Topic to explain",
    "For example: Explain the Pythagoras theorem simply.",
    "Explain Topic"
  ],

  quiz: [
    "Topic or passage",
    "Paste a passage or enter a topic for 3 MCQs.",
    "Generate Quiz"
  ],

  summarize: [
    "Text to summarize",
    "Paste an educational passage here.",
    "Summarize"
  ],

  learn: [
    "Topic to learn",
    "For example: SQL, Python, machine learning…",
    "Create Learning Path"
  ]

};


/* =========================================
   WORKSPACE INFORMATION
   ========================================= */

const workspaceInfo = {

  qa: [
    "Ask EduGenie anything",
    "Ask a question and get an AI-powered answer."
  ],

  explain: [
    "Understand any concept",
    "Get a simple, step-by-step explanation."
  ],

  quiz: [
    "Test your knowledge",
    "Generate an interactive quiz and check your score."
  ],

  summarize: [
    "Simplify your content",
    "Turn long educational content into a clear summary."
  ],

  learn: [
    "Build your learning path",
    "Create a personalized roadmap for your learning goal."
  ]

};


/* =========================================
   TASK SELECTION
   ========================================= */

function updateTaskUI() {

  const mode = task.value;

  if (!labels[mode]) {
    return;
  }

  const [label, placeholder, button] =
    labels[mode];

  inputLabel.textContent = label;

  inputText.placeholder = placeholder;

  submitBtn.textContent = button;


  /* Learning level */

  levelWrap.classList.toggle(
    "hidden",
    mode !== "learn"
  );


  /* Update mode cards */

  modeCards.forEach(card => {

    card.classList.toggle(
      "active",
      card.dataset.mode === mode
    );

  });


  /* Update workspace heading */

  if (workspaceInfo[mode]) {

    workspaceTitle.textContent =
      workspaceInfo[mode][0];

    workspaceDescription.textContent =
      workspaceInfo[mode][1];

  }

}


/* =========================================
   HIDDEN TASK SELECTOR
   ========================================= */

task.addEventListener(
  "change",
  updateTaskUI
);


/* =========================================
   VISIBLE MODE CARDS
   ========================================= */

modeCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      const mode =
        card.dataset.mode;

      if (!labels[mode]) {
        return;
      }

      /*
       * The real select is hidden.
       * Clicking a mode card changes
       * the hidden select and then
       * updates the complete UI.
       */

      task.value = mode;

      task.dispatchEvent(
        new Event("change")
      );

    }
  );

});


/* =========================================
   INITIALIZE DEFAULT MODE
   ========================================= */

updateTaskUI();


/* =========================================
   CLEAR BUTTON
   ========================================= */

clearBtn.addEventListener(
  "click",
  () => {

    inputText.value = "";

    resultCard.classList.add(
      "hidden"
    );

    result.innerHTML = "";

    updateCharacterCount();

  }
);


/* =========================================
   HTML ESCAPE
   ========================================= */

function escapeHtml(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================
   BASIC MARKDOWN RENDERER
   ========================================= */

function basicMarkdown(text) {

  text = String(text)

    .replace(
      /\\\*\\\*\\\*/g,
      "---"
    )

    .replace(
      /\\\*\\\*/g,
      "**"
    )

    .replace(
      /\\\*/g,
      "*"
    )

    .replace(
      /\\`/g,
      "`"
    )

    .replace(
      /\\\./g,
      "."
    )

    .replace(
      /\\#/g,
      "#"
    )

    .replace(
      /\\-/g,
      "-"
    );


  let safe =
    escapeHtml(text);


  /* Code blocks */

  safe = safe.replace(
    /```([\s\S]*?)```/g,
    "<pre><code>$1</code></pre>"
  );


  /* Inline code */

  safe = safe.replace(
    /`([^`\n]+)`/g,
    "<code>$1</code>"
  );


  /* Headings */

  safe = safe.replace(
    /^### (.*)$/gm,
    "<h3>$1</h3>"
  );

  safe = safe.replace(
    /^## (.*)$/gm,
    "<h2>$1</h2>"
  );

  safe = safe.replace(
    /^# (.*)$/gm,
    "<h1>$1</h1>"
  );


  /* Bold */

  safe = safe.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );


  /* Italic */

  safe = safe.replace(
    /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    "<em>$1</em>"
  );


  /* Horizontal rule */

  safe = safe.replace(
    /^---+$/gm,
    "<hr>"
  );


  /* Numbered lists */

  safe = safe.replace(
    /(?:^|\n)((?:\d+\. .*(?:\n|$))+)/g,
    (match, list) => {

      const items =
        list
          .trim()
          .split("\n")
          .map(item =>
            item
              .replace(
                /^\d+\. /,
                ""
              )
              .trim()
          )
          .map(item =>
            `<li>${item}</li>`
          )
          .join("");

      return `\n<ol>${items}</ol>\n`;

    }
  );


  /* Bullet lists */

  safe = safe.replace(
    /(?:^|\n)((?:[-*] .*(?:\n|$))+)/g,
    (match, list) => {

      const items =
        list
          .trim()
          .split("\n")
          .map(item =>
            item
              .replace(
                /^[-*] /,
                ""
              )
              .trim()
          )
          .map(item =>
            `<li>${item}</li>`
          )
          .join("");

      return `\n<ul>${items}</ul>\n`;

    }
  );


  /* Line breaks */

  safe = safe.replace(
    /\n/g,
    "<br>"
  );


  /* Remove unnecessary breaks */

  safe = safe.replace(
    /<br>(?=<\/?(?:h1|h2|h3|ul|ol|pre|hr))/g,
    ""
  );

  safe = safe.replace(
    /(?<=<\/(?:h1|h2|h3|ul|ol|pre|hr)>)<br>/g,
    ""
  );


  return safe;

}


/* =========================================
   QUIZ RENDERING
   ========================================= */

function renderQuiz(questions) {

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {

    result.innerHTML =
      '<div class="error">No quiz questions were generated.</div>';

    return;

  }


  let score = 0;

  let answered = 0;


  result.innerHTML = `

    <div class="quiz-intro">

      <div>

        <span class="quiz-label">
          AI GENERATED QUIZ
        </span>

        <h3>
          Test your knowledge
        </h3>

        <p>
          Choose the best answer for each question.
        </p>

      </div>


      <div class="quiz-progress">

        <span id="quizProgress">
          0 / ${questions.length}
        </span>

      </div>

    </div>


    <div class="quiz-container">

      ${questions.map(
    (q, qi) => `

        <article
          class="quiz-question"
          data-index="${qi}">

          <div class="question-number">
            Question ${qi + 1}
          </div>


          <strong class="question-text">

            ${escapeHtml(
      q.question
    )}

          </strong>


          <div class="quiz-options">

            ${q.options.map(
      (option, oi) => `

              <button

                type="button"

                class="quiz-option"

                data-q="${qi}"

                data-o="${oi}">

                <span class="option-letter">

                  ${String.fromCharCode(
        65 + oi
      )}

                </span>


                <span>

                  ${escapeHtml(
        option
      )}

                </span>

              </button>

            `
    ).join("")}

          </div>


          <div
            class="feedback"
            id="feedback-${qi}">

          </div>


        </article>

      `
  ).join("")}

    </div>


    <div
      id="quizSummary"
      class="quiz-summary hidden">

    </div>

  `;


  const progress =
    document.getElementById(
      "quizProgress"
    );


  /* =========================================
     QUIZ OPTION CLICK
     ========================================= */

  result
    .querySelectorAll(".quiz-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const questionIndex =
            Number(
              button.dataset.q
            );

          const optionIndex =
            Number(
              button.dataset.o
            );


          const question =
            questions[
            questionIndex
            ];


          const selected =
            question.options[
            optionIndex
            ];


          const feedback =
            document.getElementById(
              `feedback-${questionIndex}`
            );


          const buttons =
            result.querySelectorAll(
              `.quiz-option[data-q="${questionIndex}"]`
            );


          /* Prevent answering twice */

          if (
            result.querySelector(
              `.quiz-option[data-q="${questionIndex}"].answered`
            )
          ) {

            return;

          }


          /* Disable all options */

          buttons.forEach(
            btn => {

              btn.disabled = true;

              btn.classList.add(
                "answered"
              );

            }
          );


          answered++;


          /* Correct answer */

          if (
            selected ===
            question.answer
          ) {

            score++;

            button.classList.add(
              "correct"
            );


            feedback.innerHTML = `

              <span class="feedback-icon">
                ✓
              </span>

              Correct!

              ${escapeHtml(
              question.explanation || ""
            )}

            `;

          }


          /* Wrong answer */

          else {

            button.classList.add(
              "wrong"
            );


            buttons.forEach(
              btn => {

                const btnOption =
                  question.options[
                  Number(
                    btn.dataset.o
                  )
                  ];


                if (
                  btnOption ===
                  question.answer
                ) {

                  btn.classList.add(
                    "correct"
                  );

                }

              }
            );


            feedback.innerHTML = `

              <span class="feedback-icon">
                !
              </span>

              Correct answer:

              <strong>
                ${escapeHtml(
              question.answer
            )}
              </strong>

              ${escapeHtml(
              question.explanation || ""
            )}

            `;

          }


          /* Update progress */

          progress.textContent =
            `${answered} / ${questions.length}`;


          /* Show final result */

          if (
            answered ===
            questions.length
          ) {

            showQuizSummary(
              score,
              questions.length,
              questions
            );

          }

        }
      );

    });

}


/* =========================================
   QUIZ SUMMARY
   ========================================= */

function showQuizSummary(
  score,
  total,
  questions
) {

  const percentage =
    Math.round(
      (score / total) * 100
    );


  let message;


  if (
    percentage === 100
  ) {

    message =
      "Perfect score! Outstanding work! 🎉";

  }

  else if (
    percentage >= 70
  ) {

    message =
      "Great job! Keep building your knowledge. 🚀";

  }

  else if (
    percentage >= 40
  ) {

    message =
      "Good attempt! A little more practice will help. 💪";

  }

  else {

    message =
      "Keep learning! Try the quiz again and improve your score. 📚";

  }


  const summary =
    document.getElementById(
      "quizSummary"
    );


  summary.classList.remove(
    "hidden"
  );


  summary.innerHTML = `

    <div class="score-icon">
      🎯
    </div>


    <div class="score-content">

      <span class="quiz-label">
        QUIZ COMPLETE
      </span>


      <h3>
        ${score} / ${total}
      </h3>


      <div class="score-percentage">

        ${percentage}% Accuracy

      </div>


      <p>
        ${message}
      </p>


      <button
        type="button"
        class="retry-quiz"
        id="retryQuiz">

        ↻ Try Again

      </button>

    </div>

  `;


  /* Try again */

  document
    .getElementById(
      "retryQuiz"
    )
    .addEventListener(
      "click",
      () => {

        renderQuiz(
          questions
        );

      }
    );


  /* Scroll to score */

  summary.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}
/* =========================================
   AI LOADING EXPERIENCE
   ========================================= */

let loadingTimer = null;
let loadingIndex = 0;

const loadingMessages = [
  "Understanding your request...",
  "Thinking through the topic...",
  "Building your response...",
  "Organizing the information...",
  "Almost there..."
];


function startLoadingExperience() {

  loadingIndex = 0;

  result.innerHTML = `
    <div class="ai-loading">

      <div class="ai-loading-orb">
        ✦
      </div>

      <div class="ai-loading-content">

        <strong>
          EduGenie is thinking
        </strong>

        <span id="loadingMessage">
          ${loadingMessages[0]}
        </span>

      </div>

      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  `;


  submitBtn.classList.add("loading");

  submitBtn.disabled = true;

  submitBtn.innerHTML = `
    <span class="generate-icon loading-spinner">
      ◌
    </span>

    <span>
      Generating...
    </span>
  `;


  loadingTimer = setInterval(() => {

    loadingIndex =
      (loadingIndex + 1) %
      loadingMessages.length;

    const loadingMessage =
      document.getElementById(
        "loadingMessage"
      );

    if (loadingMessage) {

      loadingMessage.classList.remove(
        "loading-message-change"
      );

      void loadingMessage.offsetWidth;

      loadingMessage.textContent =
        loadingMessages[loadingIndex];

      loadingMessage.classList.add(
        "loading-message-change"
      );

    }

  }, 1800);

}


function stopLoadingExperience() {

  if (loadingTimer) {

    clearInterval(
      loadingTimer
    );

    loadingTimer = null;

  }


  submitBtn.classList.remove(
    "loading"
  );

  submitBtn.disabled = false;

  submitBtn.innerHTML = `
    <span class="generate-icon">
      ✨
    </span>

    <span>
      ${labels[task.value][2]}
    </span>

    <span class="generate-arrow">
      →
    </span>
  `;

}

/* =========================================
   RUN TASK
   ========================================= */

async function runTask() {

  const text =
    inputText.value.trim();


  /* Empty input */

  if (!text) {

    resultCard.classList.remove(
      "hidden"
    );


    resultType.textContent =
      "Validation";


    result.innerHTML =
      '<div class="error">Please enter some text first.</div>';


    return;

  }


  /* Disable button */

  submitBtn.disabled = true;


  /* Show result */

  resultCard.classList.remove(
    "hidden"
  );


  resultType.textContent =
    task.options[
      task.selectedIndex
    ].text;


  startLoadingExperience();


  /* API routes */

  const routes = {

    qa: [
      "/qa",
      {
        question: text
      }
    ],


    explain: [
      "/explain",
      {
        topic: text
      }
    ],


    quiz: [
      "/quiz",
      {
        text: text
      }
    ],


    summarize: [
      "/summarize",
      {
        text: text
      }
    ],


    learn: [
      "/learn/recommendations",
      {
        topic: text,

        level:
          document.getElementById(
            "level"
          ).value
      }
    ]

  };


  try {

    const route =
      routes[task.value];


    if (!route) {

      throw new Error(
        "Invalid learning mode selected."
      );

    }


    const [
      url,
      body
    ] = route;


    /* Send request */

    const response =
      await fetch(
        url,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(body)

        }
      );


    /* Check response type */

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";


    let data;


    if (
      contentType.includes(
        "application/json"
      )
    ) {

      data =
        await response.json();

    }

    else {

      const errorText =
        await response.text();


      throw new Error(
        errorText ||
        "Request failed."
      );

    }


    /* API error */

    if (!response.ok) {

      throw new Error(
        data.detail ||
        "Request failed."
      );

    }


    /* =========================================
       QUIZ RESULT
       ========================================= */

    if (
      task.value === "quiz"
    ) {

      renderQuiz(
        data.quiz
      );

    }


    /* =========================================
       NORMAL AI RESPONSE
       ========================================= */

    else {

      const key = {

        qa:
          "answer",

        explain:
          "explanation",

        summarize:
          "summary",

        learn:
          "recommendations"

      }[task.value];


      if (!data[key]) {

        throw new Error(
          "The AI returned an empty response."
        );

      }


      result.innerHTML = `

        <div class="markdownish answer-text">

          ${basicMarkdown(
        data[key]
      )}

        </div>

      `;

    }


    /* Save to recent activity */

    saveRecentActivity(
      task.value,
      text
    );

  }


  /* =========================================
     ERROR HANDLING
     ========================================= */

  catch (error) {

    console.error(
      "EduGenie error:",
      error
    );


    result.innerHTML = `

      <div class="error">

        ${escapeHtml(
      error.message ||
      "Something went wrong."
    )}

      </div>

    `;

  }


  /* Re-enable button */

  /* Stop loading experience */
  finally {
    stopLoadingExperience();
  }

}


/* =========================================
   SUBMIT BUTTON
   ========================================= */

submitBtn.addEventListener(
  "click",
  runTask
);


/* =========================================
   CTRL + ENTER
   ========================================= */

inputText.addEventListener(
  "keydown",
  event => {

    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {

      event.preventDefault();

      runTask();

    }

  }
);


/* =========================================
   ESCAPE KEY
   ========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      inputText.value = "";

      resultCard.classList.add(
        "hidden"
      );

      result.innerHTML = "";

      updateCharacterCount();

    }

  }
);


/* =========================================
   CHARACTER COUNT
   ========================================= */

function updateCharacterCount() {

  if (!charCount) {
    return;
  }


  const length =
    inputText.value.length;


  charCount.textContent =
    `${length} character${length === 1 ? "" : "s"}`;

}


inputText.addEventListener(
  "input",
  updateCharacterCount
);


updateCharacterCount();


/* =========================================
   SMART SUGGESTIONS
   ========================================= */

suggestions.forEach(
  suggestion => {

    suggestion.addEventListener(
      "click",
      () => {

        inputText.value =
          suggestion.dataset.prompt ||
          "";

        inputText.focus();

        updateCharacterCount();

      }
    );

  }
);


/* =========================================
   COPY RESPONSE
   ========================================= */

if (copyBtn) {

  copyBtn.addEventListener(
    "click",
    async () => {

      const text =
        result.innerText.trim();


      if (!text) {
        return;
      }


      try {

        await navigator.clipboard.writeText(
          text
        );


        const originalText =
          copyBtn.textContent;


        copyBtn.textContent =
          "Copied!";


        setTimeout(
          () => {

            copyBtn.textContent =
              originalText;

          },
          1500
        );

      }

      catch (error) {

        console.error(
          "Copy failed:",
          error
        );

      }

    }
  );

}


/* =========================================
   REGENERATE RESPONSE
   ========================================= */

if (regenerateBtn) {

  regenerateBtn.addEventListener(
    "click",
    () => {

      if (
        !inputText.value.trim()
      ) {

        return;

      }


      runTask();

    }
  );

}


/* =========================================
   THEME TOGGLE
   ========================================= */

if (themeBtn) {

  themeBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light-theme"
      );


      const isLight =
        document.body.classList.contains(
          "light-theme"
        );


      themeBtn.textContent =
        isLight
          ? "☾"
          : "☼";


      localStorage.setItem(
        "edugenie-theme",
        isLight
          ? "light"
          : "dark"
      );

    }
  );


  /* Load saved theme */

  const savedTheme =
    localStorage.getItem(
      "edugenie-theme"
    );


  if (
    savedTheme === "light"
  ) {

    document.body.classList.add(
      "light-theme"
    );

    themeBtn.textContent =
      "☾";

  }

}


/* =========================================
   RECENT LEARNING HISTORY
   ========================================= */

function saveRecentActivity(
  mode,
  text
) {

  let history;


  try {

    history =
      JSON.parse(
        localStorage.getItem(
          "edugenie-history"
        )
      ) || [];

  }

  catch {

    history = [];

  }


  history.unshift({
    mode: mode,
    text: text,
    time: new Date().toLocaleString()
  });


  /* Keep latest 6 */

  history =
    history.slice(0, 6);


  localStorage.setItem(
    "edugenie-history",
    JSON.stringify(history)
  );


  renderRecentActivity();

}


/* =========================================
   RENDER RECENT ACTIVITY
   ========================================= */

function renderRecentActivity() {

  if (!recentActivity) {
    return;
  }


  let history;


  try {

    history =
      JSON.parse(
        localStorage.getItem(
          "edugenie-history"
        )
      ) || [];

  }

  catch {

    history = [];

  }


  if (history.length === 0) {

    recentActivity.innerHTML = `

      <div class="empty-history">

        <div class="empty-icon">
          ◌
        </div>

        <div>

          <strong>
            Your learning activity will appear here
          </strong>

          <span>
            Start exploring EduGenie to build your history.
          </span>

        </div>

      </div>

    `;

    return;

  }


  recentActivity.innerHTML =
    history.map(
      item => `

        <button
          type="button"
          class="recent-item"
          data-mode="${escapeHtml(item.mode)}"
          data-text="${escapeHtml(item.text)}">

          <span class="recent-mode">
            ${escapeHtml(
        getModeName(item.mode)
      )}
          </span>

          <strong>
            ${escapeHtml(
        item.text.length > 80
          ? item.text.slice(0, 80) + "..."
          : item.text
      )}
          </strong>

          <small>
            ${escapeHtml(item.time)}
          </small>

        </button>

      `
    ).join("");


  /* Click history item */

  recentActivity
    .querySelectorAll(".recent-item")
    .forEach(
      item => {

        item.addEventListener(
          "click",
          () => {

            const mode =
              item.dataset.mode;

            const text =
              item.dataset.text;


            if (
              labels[mode]
            ) {

              task.value =
                mode;

              task.dispatchEvent(
                new Event("change")
              );

            }


            inputText.value =
              text;

            updateCharacterCount();

            inputText.focus();

          }
        );

      }
    );

}


/* =========================================
   MODE NAME
   ========================================= */

function getModeName(mode) {

  const names = {

    qa:
      "Ask Question",

    explain:
      "Explain",

    quiz:
      "Quiz",

    summarize:
      "Summarize",

    learn:
      "Learning Path"

  };


  return (
    names[mode] ||
    mode
  );

}


/* =========================================
   CLEAR HISTORY
   ========================================= */

if (clearHistoryBtn) {

  clearHistoryBtn.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "edugenie-history"
      );

      renderRecentActivity();

    }
  );

}


renderRecentActivity();


/* =========================================
   BACKEND / GEMINI STATUS
   ========================================= */

fetch("/health")

  .then(
    response => {

      if (!response.ok) {

        throw new Error(
          "Health check failed"
        );

      }

      return response.json();

    }
  )

  .then(
    data => {

      if (
        data.gemini_configured
      ) {

        statusBadge.textContent =
          "Gemini connected";

      }

      else {

        statusBadge.textContent =
          "Gemini key missing";

      }

    }
  )

  .catch(
    () => {

      statusBadge.textContent =
        "Backend unavailable";

    }
  );