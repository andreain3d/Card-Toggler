const userInfo = {
//    "cardHolder":"Dave Normalname",
//    "cards":[
//        {"cardId":"0001","cardName":"Rewards Card","maskedCardNumber":"xx0455", "active":true},
//        {"cardId":"0002","cardName":"Cash Back Card","maskedCardNumber":"xx0456", "active":true}
//    ]
};

const userId = "012345";
//const cardId = "0001";

function greet() {
    $('#greeting').text('Welcome, ' + userInfo.cardHolder + '!');
    $('#greeting').fadeTo("slow", 100);
    $('#greeting').delay(2000).animate({ opacity: 0 });
}

function getUserInfo () {
    console.log("userId: " + userId);
    $.ajax({
        url: '/userInfo/' + userId,
        type: "GET",
        success: function (data) {
            let info = JSON.parse(data);
            userInfo.cardHolder = info.cardHolder;
            userInfo.cards = info.cards;
            //initializing 'active' status as true as dummy info for the property
            for (let i = 0; i < userInfo.cards.length; i++){
                userInfo.cards[i].active = true;
            }
            console.log("Retrieved userInfo: " + JSON.stringify(userInfo));
             for (let i=0; i < userInfo.cards.length; i++ ){
                 $('#select-input select').append($('<option>', {
                     value: userInfo.cards[i].maskedCardNumber,
                     text: userInfo.cards[i].cardName+ " " + userInfo.cards[i].maskedCardNumber
                 }));
             }
            greet();
            setCardImage($('ons-select')[0].value);
        },
        error: function (error) {
            console.log(`Error retrieving user data: ${error}`);
        }
    })
}

function cardChangeHandler (event) {
        $('.card').text('Card ending in ' + event.target.value);
        $('.card').css("background-image", "url(\"cc1.jpg\")");
                $('#toggle-activation').remove();

                if (
                    userInfo.cards[$('ons-select')[0].selectedIndex].active
                ) {
                    $('#switch-container').append("<ons-switch checked id=\"toggle-activation\"></ons-switch>");
                    toggleActivationHandler();
                } else {
                    $('#switch-container').append("<ons-switch id=\"toggle-activation\"></ons-switch>");
                    toggleActivationHandler();
                };

};

async function sendToggleData(cardId, toggleData) {
    console.log(cardId);
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

function toggleActivationHandler() {
    $('#toggle-activation').change(
        function(){
            if (userInfo.cards[$('ons-select')[0].selectedIndex].active) {
                sendToggleData(userInfo.cards[$('ons-select')[0].selectedIndex].cardId, {"active":false}).then((data) => {
                console.log(data);
                    if(JSON.parse(data).message == "okay"){
                        userInfo.cards[$('ons-select')[0].selectedIndex].active = false;
                       ons.notification.toast("Your card ending in " + userInfo.cards[$('ons-select')[0].selectedIndex].maskedCardNumber + " has been successfully disabled.", { timeout: 1500, animation: 'fade' })
                    } else {
                        ons.notification.toast("An error has occurred.")
                    }
                });

            } else {
                sendToggleData(userInfo.cards[$('ons-select')[0].selectedIndex].cardId, {"active": true}).then((data) => {
                    console.log(data);
                    if(JSON.parse(data).message == "okay"){
                        userInfo.cards[$('ons-select')[0].selectedIndex].active = true;
                        ons.notification.toast("Your card ending in " + userInfo.cards[$('ons-select')[0].selectedIndex].maskedCardNumber + " has been successfully enabled.", { timeout: 1500, animation: 'fade' })
                    } else {
                        ons.notification.toast("An error has occurred.", { timeout: 1500, animation: 'fade' })
                    }
                })

            };
        }
    )
}

function setCardImage (maskedNum) {
    $('.card').text('Card ending in ' + maskedNum);
    $('.card').css("background-image", "url(\"cc1.jpg\")");
}

async function sendReportData(reportData) {
    console.log(reportData);
    let response;

    try{
        response = await $.ajax({
            url: '/report',
            type: 'POST',
            data: reportData
        })

        return response;
    }catch(err) {
        console.log("Error sending toggle data: " + JSON.stringify(err));
    };
};

function reportSubmitHandler () {
    const reportData = { "cardId": userInfo.cards[$('ons-select')[0].selectedIndex].cardId,
                          "cardStatus": $('#report-select')[0].value,
                           "comment": $('#report-details')[0].value };
    console.log(reportData);
    sendReportData(reportData).then((data) => {
            console.log(data);
            ons.notification.toast("Your report has been submitted successfully.", { timeout: 1500, animation: 'fade' });
        })
};

document.addEventListener('init', function(event) {
    console.log("init running");
    let page = event.target;

    if (page.id === 'cards') {
      page.querySelector('#report-button').onclick = function() {
        document.querySelector('#appNavigator').pushPage('report.html', {data: {cardInfo: userInfo.cards[$('ons-select')[0].selectedIndex]}});
      };
    } else if (page.id === 'report') {
      setCardImage(page.data.cardInfo.maskedCardNumber);
    }
});

$(document).ready(function(){
    console.log($('ons-select'));
    getUserInfo();
    toggleActivationHandler();
});