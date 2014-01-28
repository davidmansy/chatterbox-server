/**
* File: Eli Kirk
* Scripts for Eli Kirk theme
* Author: Jared Butterfield - Eli Kirk
* Email: jaredb@elikirk.com
**/

jQuery(document).ready(function(){
    elk.init();
});

/**
* Eli Kirk Namespace
**/
var elk = function() {
    // Private
	var social_flag = false; // Social links are hidden when false
	
	
	/**
     * Function: setupSocial
     * Set events to show/hide social links on single post pages
     */
	function setupSocial(){
		// Verify a single page with sociable
		if(jQuery("#share-post").length > 0){
			jQuery("#share-post").click(function(){
				var btn = this;
				if(social_flag){
					// Hide
					jQuery("#social-links").fadeOut(600, function(){});
					jQuery(btn).animate({left:'0px'}, 800);
				}else{
					// Show
					var width = jQuery("#social-links").width() + 20;
					jQuery(btn).animate({left: '-='+width}, 800, function() {
					    jQuery("#social-links").fadeIn(600);
					});
				}
				social_flag = !social_flag;
			});
		}
		
		// Verify copy url
		var link = jQuery("#select-copy-url");
		if(link.length > 0){
			var input = jQuery("#copy-url-text");
			link.click(function(){
				input.focus().select();
			})
		}
	}
	
	/**
     * Function: setupContactForm
     * Set events to allow a tag to submit form
     */
	function setupContactForm(){
		if(jQuery(".wpcf7-form").length > 0 && jQuery("#submit-contact-form").length > 0){
			jQuery("#submit-contact-form").click(function(){
				jQuery(".wpcf7-form")[0].submit();
			})
		}
	}

    // Public 
    return {

        /**
          * Function: init
          * Initializes namespace variables and objects
          */
        init : function() {
			setupSocial();
			setupContactForm();
        }       
    };

} ();