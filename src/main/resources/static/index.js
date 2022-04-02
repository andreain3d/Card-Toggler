const userInfo = {
//    "cardHolder":"Dave Normalname",
//    "cards":[
//        {"cardId":"0001","cardName":"Rewards Card","maskedCardNumber":"xx0455", "active":true},
//        {"cardId":"0002","cardName":"Cash Back Card","maskedCardNumber":"xx0456", "active":true}
//    ]
};

function greet() {
    $('#greeting').text('Welcome, ' + userInfo.cardHolder + '!');
    $('#greeting').fadeTo("slow", 100);
    $('#greeting').delay(2000).animate({ opacity: 0 });
}

function getUserInfo () {
    $.ajax({
        url: '/userInfo',
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
                     text: "Your Card ending in " + userInfo.cards[i].maskedCardNumber
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
        $('.card').text('Card ending in ' + event.target.value)
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

async function sendToggleData(toggleData) {
    let response;

    try{
        response = await $.ajax({
            url: '/onoff',
            type: 'POST',
            data: toggleData
        })

        return response;
    }catch(err) {
        console.log("Error sending toggle data: " + err);
    };
};

function toggleActivationHandler() {
    $('#toggle-activation').change(
        function(){
            if (userInfo.cards[$('ons-select')[0].selectedIndex].active) {
                sendToggleData({"active":false}).then((data) => {
                console.log(data);
                    if(JSON.parse(data).message == "okay"){
                        userInfo.cards[$('ons-select')[0].selectedIndex].active = false;
                       ons.notification.toast("Your card ending in " + userInfo.cards[$('ons-select')[0].selectedIndex].maskedCardNumber + " has been successfully disabled.", { timeout: 1500, animation: 'fade' })
                    } else {
                        ons.notification.toast("An error has occurred.")
                    }
                });

            } else {
                sendToggleData({"active": true}).then((data) => {
                    console.log(data);
                    if(JSON.parse(data).message == "okay"){
                        userInfo.cards[$('ons-select')[0].selectedIndex].active = true;
                        ons.notification.toast("Your card ending in " + userInfo.cards[$('ons-select')[0].selectedIndex].maskedCardNumber + " has been successfully enabled.", { timeout: 1500, animation: 'fade' })
                    } else {
                        ons.notification.toast("An error has occurred.")
                    }
                })

            };
        }
    )
}

function setCardImage (maskedNum) {
    $('.card').text('Card ending in ' + maskedNum);
}

$(document).ready(function(){
    getUserInfo();
    toggleActivationHandler();
});