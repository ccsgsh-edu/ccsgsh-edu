/*!
* 
* 
*
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
window.addEventListener("load", () => {
    setTimeout(() =>{
        const container = document.querySelector('.container23');
        container.classList.add('container23--hidden');
    }, 2000);

    var name = 'Test name';
    var gender = 'M';
    var email = 'test@mail.com'
    var currentQuestionIndex = 0;
    var ctr = 0;
    var courseResult = '<<COURSE RESULT HERE>'
    var result = '<<RESULT HERE>>';
    var audio = document.getElementById("bg-music");
    var numberOfQuestions = 30;
    var shuffledQuestions = shuffleArray(ccsQuestions.slice(0, numberOfQuestions)); // Shuffled copy of the questions array
    var userAnswers = []; // Array to store user's answers
    // Get the forms we want to add validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }
        form.classList.add('was-validated');
        name = $('#name').val();
        gender = $('#gender').val();
        email = $('#email').val();
        $('#mainContainer').hide();
        $('#namelbl').text(name);
        $('#welcomeContainer').fadeIn(1000);
        if (gender == 'M') {
            $('#avatarMale').show();
            $('#avatarFemale').hide();
            $('.overlay-text').addClass('m');
            $('.overlay-text').removeClass('f');
            $('.sub-overlay-text').addClass('m');
            $('.sub-overlay-text').removeClass('f');
        } else if(gender == 'F'){
            $('#avatarMale').hide();
            $('#avatarFemale').show();
            $('.overlay-text').removeClass('m');
            $('.overlay-text').addClass('f');
            $('.sub-overlay-text').removeClass('m');
            $('.sub-overlay-text').addClass('f');
        }
      }, false);
    });
    //displayQuestions();

    // Event handler for user info submission
    $('#readyBtn').click(function() {
        $('#welcomeContainer').hide();
        $('#questionContainer').fadeIn(500, function() {
            displayQuestions();
        });
        audio.play();
    });
    $('#nextBtn').click(function() {
        var selectedValue = $('input[name="answer"]:checked').val();
        // If there are more questions, display the next question
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            // If no radio button is selected, show the error message and return
            if (!selectedValue) {
                $('#error').show();
                return;
            }
            // Hide the error message
            $('#error').hide();
            // Save the user's answer and display the next question
            userAnswers.push(parseInt(selectedValue));
            // Increment the current question index
            currentQuestionIndex++;
            // Hide the previous question
            $('#quiz .question').fadeOut(500, function() {
                // Display the next question
                displayQuestions();
            });
        } else {
            if (!selectedValue) {
                $('#error').show();
                return;
            }
            $('#modalNamelbl').text("Thank you "+ name + "!");
            $('#modalBtn').click();
            // Otherwise, calculate the score and display the end message
            var score = calculateScore(userAnswers);
            courseResult = suggestCourses(score);
            result = formatEmailText(courseResult);
            audio.pause();
            audio.currentTime = 0;
            sendMail(name, email, score, result);
        }

        if(currentQuestionIndex == shuffledQuestions.length - 1) {
            $('#nextBtn').text("Finish")
        } 
    });
    $('#modalCloseBtn').click(function() {
        location.reload();
    });
    function displayQuestions() {
        var question = shuffledQuestions[currentQuestionIndex];
        var choices = question.choices.map(function(choice) {
            var rctr = ctr++;
            return `<div class="frb frb-success">
            <input type="radio" required name="answer" id="radio-button-${rctr}" value="${choice.value}">
            <label for="radio-button-${rctr}">
                <span class="frb-description">${choice.label}</span>
            </label>
            </div>`;
        });
    
        var questionHTML = `
        <div class="question">
            <h2 class="text-white mt-0 text-center">${question.question}</h2>
            <p class="text-white-75 mb-4 text-center">${currentQuestionIndex + 1}/${numberOfQuestions}
            <hr class="divider divider-light" />
            <div class="frb-group">
            ${choices.join('')}
            </div></div>
        `;
        // Append the new question and fade it in
        $('#quiz').empty().append(questionHTML).fadeIn(500);
    }
    // Function to shuffle an array
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
        return array;
    }
    // Function to calculate the score based on user's answers
    function calculateScore(answers) {
        var totalScore = 0;
        answers.forEach(function(answer) {
            totalScore += answer;
        });
        return totalScore;
    }
    // Function to choose course base from the score
    function suggestCourses(score) {
        var suggestedCourses = [];
        
        courseSuggestions.forEach(function(suggestion) {
            if (score >= suggestion.scoreRange[0] && score <= suggestion.scoreRange[1]) {
                suggestedCourses = suggestion.courses;
            }
        });
        return suggestedCourses;
    }
    // Function to send email
    function sendMail(name, email, score, result) {
        let params = {
            name: name,
            score: score,
            message: result,
            email: email
        }
        emailjs.send("service_zx1alxp", "template_f35cssh", params).then(
            console.log("Email Sent!")
        );
    }
    // Function to format data into email text
    function formatEmailText(data) {
    let emailText = "Here are the Courses and Associated schools we found that fit you:\n\n";

    data.forEach(course => {
        emailText += `Course Name: ${course.name}\n`;
        emailText += "Associated Schools:\n";
        course.schools.forEach(school => {
            emailText += `  - ${school}\n`; // Append each school as a bullet point
        });
        emailText += "\n"; // Add newline between courses
    });

    return emailText;
    }
});
