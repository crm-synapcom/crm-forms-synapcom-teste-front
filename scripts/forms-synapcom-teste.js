$(document).ready(function() {
    $('#contact_firstname').on('focusout', function() {
        var input = $(this);
        var test = input.val();
        if(test){
            input.removeClass('invalid').addClass('valid');
        }
        else{
            input.removeClass('valid').addClass('invalid');
        }
    });

    // $('#contact_lastname').on('focusout', function() {
    //     var input = $(this);
    //     var test = input.val();
    //     if(test){
    //         input.removeClass('invalid').addClass('valid');
    //     }
    //     else{
    //         input.removeClass('valid').addClass('invalid');
    //     }
    // });

    $('#contact_email').on('focusout', function() {
        var input=$(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var test=re.test(input.val());
        if(test){
            input.removeClass('invalid').addClass('valid');
        }
        else{
            input.removeClass('valid').addClass('invalid');
        }
    });

    $('#contact_phone').on('focusout', function() {
        var input=$(this);
        var re = /^\(\d{2}\)9[1-9]\d{3}-\d{4}/;
        var test = re.test(input.val());
        if(test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        }
        else{input.removeClass("valid").addClass("invalid");}
    });


    // input behavior
    $("#contact_phone").on("input", function() {
        var v = this.value;
        
        // prevents from entering non number input
        if(isNaN(v[v.length-1])){
            this.value = v.substring(0, v.length-1);
            return;
        }
        
        this.setAttribute("maxlength", "14");
        if (v.length == 1) this.value = "(" + this.value;
        if (v.length == 3) this.value = this.value += ")";
        if (v.length == 9) this.value = this.value += "-";
    });

    // checkbox and radio click behavior
    $("#contact_sms_checker").on("click", function() {
        if($('#contact_sms_checker').is(':checked') == false) {
            $('#phone_block').hide()
            $('#contact_phone').prop( "disabled", true)
            $('#contact_phone').val('')
            $('#contact_phone').removeClass("invalid").addClass("valid");
        } else {
            $('#phone_block').show()
            $('#contact_phone').prop( "disabled", false)
            $('#contact_phone').removeClass("valid").addClass("invalid");
        }
    });

    $('#contact_submit').click(function(event){
        event.preventDefault();

        // verifying inputs
        if($('#contact_firstname').hasClass('invalid')){
            alert('Por favor, insira seu nome.')
            return
        }
        // if($('#contact_lastname').hasClass('invalid')){
        //     alert('Por favor, insira seu sobrenome.')
        //     return
        // }
        if($('#contact_email').hasClass('invalid')){
            alert('Por favor, insira um email válido.')
            return
        }
        if($('#contact_sms_checker').is(':checked') && $('#contact_phone').hasClass('invalid')){
            alert('Por favor, insira um número de celular válido.')
            return
        }
        if(!$("input[name='gender_radio']").is(':checked')) {
            alert('Por favor, escolha um gênero.')
            return
        }
        if(!$('#contact_privacy_policy_checker').is(':checked')) {
            alert('Para se cadastrar é necessário concordar com a política de privacidade.')
            return
        }

        // getting URL parameters
        var self = window.location.toString();
        var querystring = self.split("?");
        if (querystring.length > 1) {
            var pairs = querystring[1].split("&");
            for (i in pairs) {
                var keyval = pairs[i].split("=");
                if (sessionStorage.getItem(keyval[0]) === null) {
                sessionStorage.setItem(keyval[0], decodeURIComponent(keyval[1]));
                }
            }
        }

        var rest_data = {
            'first_name': $('#contact_firstname').val(),
            'email': $('#contact_email').val(),
            'gender': $('input[name="gender_radio"]:checked', '#contact-form').val(),
            'email_optin': $("#contact_email_checker").is(":checked"),
            'sms_optin': $("#contact_sms_checker").is(":checked"),
            'phone': $('#contact_phone').val(),
            'utm_source': sessionStorage.getItem('utm_source') == null ? '' : sessionStorage.getItem('utm_source'),
            'utm_medium': sessionStorage.getItem('utm_medium') == null ? '' : sessionStorage.getItem('utm_medium'),
            'utm_campaign': sessionStorage.getItem('utm_campaign') == null ? '' : sessionStorage.getItem('utm_campaign'),
            'utm_term': sessionStorage.getItem('utm_term') == null ? '' : sessionStorage.getItem('utm_term'),
            'utm_content': sessionStorage.getItem('utm_content') == null ? '' : sessionStorage.getItem('utm_content'),
            'source_page': querystring[0],
            'privacy_policy': 'https://www.levi.com.br/institucional/politica-de-privacidade'
        }

        $.ajax({
            url: 'https://mby6n8y38i.execute-api.us-east-1.amazonaws.com/prod/lead',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utm-8',
            data: JSON.stringify(rest_data),
            success: function() {
                alert('Cadastro realizado com sucesso!!!')
                $('input').each(function() {
                    if($(this).is(':text')) {
                        $(this).val('')
                        $(this).removeClass("valid").addClass("invalid")
                    }
                })
            },
            error: function() {

            }
        })

    });
});