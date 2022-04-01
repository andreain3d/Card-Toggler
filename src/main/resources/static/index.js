const userInfo = {
//    "cardHolder":"Dave Normalname",
//    "cards":[
//        {"cardId":"0001","cardName":"Rewards Card","maskedCardNumber":"xx0455", "active":true},
//        {"cardId":"0002","cardName":"Cash Back Card","maskedCardNumber":"xx0456", "active":true}
//    ]
};

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
                $('#card-select').append("<option value=\"" + userInfo.cards[i].maskedCardNumber + "\">Card ending in " + userInfo.cards[i].maskedCardNumber + "</option>")
            }
            $('#greeting').text('Welcome, ' + userInfo.cardHolder + '!')
            setCardImage();
        },
        error: function (error) {
            console.log(`Error retrieving user data: ${error}`);
        }
    })
}

function cardChangeHandler () {
    $('#card-select').change(
        function(){
            $('.card').text('Card ending in ' + $('#card-select').val())
            $('#toggle-activation').remove();

            if (
                userInfo.cards[$('#card-select').prop('selectedIndex')].active
            ) {
                $('#switch-container').append("<input checked type=\"checkbox\" id=\"toggle-activation\">");
                toggleActivationHandler();
            } else {
                $('#switch-container').append("<input type=\"checkbox\" id=\"toggle-activation\">");
                toggleActivationHandler();
            };
        });

}

function toggleActivationHandler() {
    $('#toggle-activation').change(
        function(){
            if (
                userInfo.cards[$('#card-select').prop('selectedIndex')].active
            ) {
                userInfo.cards[$('#card-select').prop('selectedIndex')].active = false;
                window.alert("Your card ending in " + $('#card-select').val() + " has been successfully deactivated!")
            } else {
                userInfo.cards[$('#card-select').prop('selectedIndex')].active = true;
                window.alert("Your card ending in " + $('#card-select').val() + " has been successfully activated!")
            };
        }
    )
}

function setCardImage () {
    $('.card').text('Card ending in ' + $('#card-select').val());
}

$(document).ready(function(){
    getUserInfo();
    cardChangeHandler();
    toggleActivationHandler();
});