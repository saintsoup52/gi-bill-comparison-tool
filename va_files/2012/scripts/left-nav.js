$(document).ready(function() {
    //Any list item with a UL child is given the class "head"
    //This is performed by checking every LI and seeing if there is a child UL within it
    $('.accordion li').each(function() {
        $this = $(this); 
        if($this.children('ul').length>0) {
           $this.addClass('head'); 
        }
	$('.sub-menu li:last-child').addClass('lastChild'); //Fix for IE borders only
	$('.sub-sub-menu li:first-child').addClass('firstChild'); //Fix for IE borders only
	
     //add initial arrows
	 if($this.hasClass('head')) {
           $('.accordion li > a span').empty().append('<img src="va_files/2012/images/left-nav/closed.png" />');
           $('.sub-menu li > a span').empty().append('<img src="va_files/2012/images/left-nav/sub-closed.png" />');
           $('.sub-sub-menu li > a span').empty().append('<img src="va_files/2012/images/left-nav/sub-closed.png" />');

        }
    });
   //When an anchor within list item with class "head" is clicked 
   $('.accordion li.head > a').on('click', function(e) {
		e.preventDefault(); //Prevent the hyperlink from kicking in
		
		//Slide up all other sibling menu items
		$(this).parent().siblings().find('ul').slideUp(200);
		
		//Close arrows on all other sibling menu items
		if($(this).parent().parent().hasClass('accordion')){
			$(this).parent().siblings().find('span').empty().append('<img src="va_files/2012/images/left-nav/closed.png"/>');
			$(this).parent().siblings().find('ul').find('span').empty().append('<img src="va_files/2012/images/left-nav/sub-closed.png"/>');
		}
		else {
			$(this).parent().siblings().find('span').empty().append('<img src="va_files/2012/images/left-nav/sub-closed.png"/>');
		};
		$(this).parent().siblings().removeClass('active');
		$(this).parent().siblings().find('li').removeClass('active');
		
		//Toggle selection open/closed
		$(this).parent().toggleClass('active');
		$(this).parent()
			.find('ul').first()
                .stop(true,true) //Clear any queue
                .slideToggle(300); //Toggle the slide

		//Toggle arrow for selection open/closed     
        if($(this).parent().hasClass('active')) {
			if($(this).parent().parent().hasClass('accordion')){
				$(this).find('span').first().empty().append('<img src="va_files/2012/images/left-nav/open.png"/>');
			}
			else {
               $(this).find('span').first().empty().append('<img src="va_files/2012/images/left-nav/sub-open.png"/>');
			};
        }
        else {
            if($(this).parent().parent().hasClass('accordion')){
				$(this).find('span').first().empty().append('<img src="va_files/2012/images/left-nav/closed.png"/>');
			}
            else {
               $(this).find('span').first().empty().append('<img src="va_files/2012/images/left-nav/sub-closed.png"/>');
			};
			$(this).parent().removeClass('active');
        }
	});
});