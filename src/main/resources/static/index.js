const userInfo = {
};

// Dummy userId in place of info given by auth
const userId = "012345";

let currentCard;

function greet() {
    $('#greeting').text('Welcome, ' + userInfo.cardHolder + '!');
    $('#greeting').fadeTo("slow", 100);
    $('#greeting').delay(2000).animate({ opacity: 0 });
}

function setCardImage (maskedCardNumber) {
    $('.card').text('Card ending in ' + maskedCardNumber);
    $('.card').css("background-image", "url(\"cc1.jpg\")");
}

function getUserInfo () {
    $.ajax({
        url: '/userInfo/' + userId,
        type: "GET",

        success: function (data) {
            let info = JSON.parse(data);
            userInfo.cardHolder = info.cardHolder;
            userInfo.cards = info.cards;

            //initializing 'active' status to true as dummy info for the property
            for (let i = 0; i < userInfo.cards.length; i++){
                userInfo.cards[i].active = true;
            }

            // Creating select options for each card
             for (let i=0; i < userInfo.cards.length; i++ ){
                 $('#select-input select').append($('<option>', {
                     value: userInfo.cards[i].maskedCardNumber,
                     text: userInfo.cards[i].cardName+ " " + userInfo.cards[i].maskedCardNumber
                 }));
             }

            // Initial display functions using retrieved data, setting currentCard
            greet();
            setCardImage($('ons-select')[0].value);
            currentCard = userInfo.cards[$('ons-select')[0].selectedIndex];
        },
        error: function (error) {
            ons.notification.toast("An error has occurred. Please try again.");
            console.log(`Error retrieving user data: ${error}`);
        }
    })
}

function cardChangeHandler (event) {
        // Setting currentCard to newly selected card
        currentCard = userInfo.cards[$('ons-select')[0].selectedIndex];

        // Changing card display
        $('.card').text('Card ending in ' + event.target.value);
        $('.card').css("background-image", "url(\"cc1.jpg\")");

        // Setting toggle to correct initial display.
        // Removes toggle and regenerates dynamically in correct position based on active status
        $('#toggle-activation').remove();
        if (
            currentCard.active
        ) {
            $('#switch-container').append("<ons-switch checked id=\"toggle-activation\"></ons-switch>");
            toggleActivationHandler();
        } else {
            $('#switch-container').append("<ons-switch id=\"toggle-activation\"></ons-switch>");
             toggleActivationHandler();
        };

};

// Post request to /onoff to toggle
async function sendToggleData(cardId, toggleData) {
    let response;

    try{
        response = await $.ajax({
            url: '/onoff/' + cardId,
            type: 'POST',
            data: toggleData
        })

        return response;
    }catch(err) {
        console.log("Error sending toggle data: " + JSON.stringify(err));
    };
};

// Sets listener for toggle change, calls the sendToggleData ajax request, 
// then changes local data for card active status and toast alerts success/failure
function toggleActivationHandler() { 
    $('#toggle-activation').change(
        function(){
            $('#toggle-activation').prop('disabled', true)

            if (currentCard.active) {
                sendToggleData(currentCard.cardId, {"active":false}).then((data) => {
                    if(JSON.parse(data).message == "okay"){
                        currentCard.active = false;
                       ons.notification.toast("Your card ending in " + currentCard.maskedCardNumber + " has been successfully disabled.", { timeout: 1500, animation: 'fade' });
                       $('#toggle-activation').prop('disabled', false);
                    } else {
                        ons.notification.toast("An error has occurred.", { timeout: 1500, animation: 'fade' });
                        $('#toggle-activation').prop('checked', true);
                        $('#toggle-activation').prop('disabled', false);

                    }
                });

            } else {
                sendToggleData(currentCard.cardId, {"active": true}).then((data) => {
                    if(JSON.parse(data).message == "okay"){
                        currentCard.active = true;
                        ons.notification.toast("Your card ending in " + currentCard.maskedCardNumber + " has been successfully enabled.", { timeout: 1500, animation: 'fade' });
                        $('#toggle-activation').prop('disabled', false);
                    } else {
                        ons.notification.toast("An error has occurred.", { timeout: 1500, animation: 'fade' })
                        $('#toggle-activation').prop('checked', false);
                        $('#toggle-activation').prop('disabled', false);
                    }
                })

            };
        }
    )
}


// Post request for /report
async function sendReportData(reportData) {
    let response;

    try{
        response = await $.ajax({
            url: '/report',
            type: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: reportData
        })

        return response;
    }catch(err) {
        console.log("Error sending report data: " + JSON.stringify(err));
    };
};

// Builds data object to post to /request, then passes data to post call and toast alerts success/failure
function reportSubmitHandler () {
    const reportData = JSON.stringify({"cardId": currentCard.cardId,
                        "cardStatus": $('#report-select')[0].value,
                        "comment": $('#report-details')[0].value });

    sendReportData(reportData).then((data) => {
            $('#report-details')[0].value = "";
            if (JSON.parse(data).message == "okay") {
                ons.notification.toast("Your report has been submitted successfully.", { timeout: 1500, animation: 'fade' });
            } else {
                ons.notification.toast("An error has occurred.", { timeout: 1500, animation: 'fade' })
            }
            
        })
};

// Set up for ons-navigator
// Passes currentCard across to report page
document.addEventListener('init', function(event) {
    let page = event.target;

    if (page.id === 'cards') {
      page.querySelector('#report-button').onclick = function() {
        document.querySelector('#appNavigator').pushPage('report.html', {data: {cardInfo: currentCard}});
      };
    } else if (page.id === 'report') {
      setCardImage(page.data.cardInfo.maskedCardNumber);
    }
});

$(document).ready(function(){
    getUserInfo();
    toggleActivationHandler();
});