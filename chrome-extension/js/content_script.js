/*
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
window.jquery = jQuery;




(function(){
    var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
    var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
  
    this.titleCaps = function(title){
        var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
        
        while (true) {
            var m = split.exec(title);

            parts.push( title.substring(index, m ? m.index : title.length)
                .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
                    return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
                })
                .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
                .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
                    return punct + upper(word);
                })
                .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
            
            index = split.lastIndex;
            
            if ( m ) parts.push( m[0] );
            else break;
        }
        
        return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
            .replace(/(['Õ])S\b/ig, "$1s")
            .replace(/\b(AT&T|Q&A)\b/ig, function(all){
                return all.toUpperCase();
            });
    };
    
    function lower(word){
        return word.toLowerCase();
    }
    
    function upper(word){
      return word.substr(0,1).toUpperCase() + word.substr(1);
    }
})();

function fixCapitalsText (text)
{
  result = "";

  sentenceStart = true;
  for (i = 0; i < text.length; i++)
  {
    ch = text.charAt (i);

    if (sentenceStart && ch.match (/^\S$/))
    {
      ch = ch.toUpperCase ();
      sentenceStart = false;
    }
    else
    {
      ch = ch.toLowerCase ();
    }

    if (ch.match (/^[.!?\>]$/))
    {
      sentenceStart = true;
    }

    result += ch;
  }

  return result;
}

jQuery.fn.sortByDepth = function() {
    var ar = this.map(function() {
            return {length: jQuery(this).parents().length, elt: this}
        }).get(),
        result = [],
        i = ar.length;


    ar.sort(function(a, b) {
        return a.length - b.length;
    });

    while (i--) {
        result.push(ar[i].elt);
    }
    return jQuery(result);
};

 jQuery.fn.sentenceCase = function () {



                return this.each(function () {
                    var $this = jQuery(this);
                    if (this.nodeType == 3)
                        this.data =fixCapitalsText($this.text());
                    else if ($this.children().length==0)
                        $this.text(fixCapitalsText($this.text())); 
                    //$this.html(fixCapitalsText($this.html()));
                });

            };





 $.noConflict();

var expandIcon = iconPath("expand.png");

jQuery(document).ready(function ($) {
$body= $('body');

$body.addClass('companion');
    function setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    }

    //$('.topic-actions').append('<a href="#" id="fullscreen"><img src="'+ expandIcon + '"></a>');
    //$('.post').wrapAll('<div id="full"></div>');

    $('.topic-actions:eq(0)').append('&nbsp;<a href="#" id="fullscreen"><img width="24" src="'+ expandIcon + '"></a>');
    $('.post, .topic-actions:eq(1)').wrapAll('<div id="full"></div>');


    $('#fullscreen').click(function(){
            //$('#full').fullScreen(true);
        //$('#full').fullscreen({documentScroll:true,overflow:'visible', toggleClass:'fullscreen'});

        $('#full').css({position:'absolute', top:0,left:0,width:'100%',height:'100%'});
        $('#full').prepend('<div style="text-align:center" id="fullexit"><a href="#" id="exitfull">To exit click here or press escape</a></div>');

        $('#exitfull').click(function(e){
            $('#full').attr('style', '');
            $('#full div:eq(0)').remove();
        });
         $('body').keydown(function(e){
           
            if(e.which == 27){
                $('#full').attr('style', '');
                $('#full div:eq(0)').remove();
            }
        });

    });

    chrome.storage.sync.get(pluginData, function (items) {

if (items.fixBody) {
    var ar = []; 
    $('.post .content').each(function(i){
        var $this = $(this);
        $this.contents().filter(function() {
            return this.nodeType === 3; //Node.TEXT_NODE
        }).wrap('<span></span>');


        //var $this = $(this);
        //$this.sentenceCase();
        //$('*', $this).sentenceCase();
        $('*', $this).not('cite').sortByDepth().sentenceCase();
        //var elems = $('*', $this).sortByDepth();
        /*elems.each(function() {
            $(this).contents().filter(function() {
                return this.nodeType === 3; //Node.TEXT_NODE
            }).sentenceCase();
        }); */

     
        

    });
}

        if (items.fullWidth) {
            $body.addClass('options-fullwidth');
        }

        if (items.imagefix) {
           
            var $posts = jQuery('.post');
            $posts.each(function (i) {
                var $fbs = [];
                jQuery('.attach-image', this).each(function () {
                    var group = "group-" + i;
                    var $imgs = $('img', this);
                   
                    $imgs.each(function () {
                        var $this = $(this);
                        if ($this.width() > 600 || $this.height() > 350) {
                            $this.width(600);
                            $this.parent().css('overflow', 'visible');
                            $this.parent().parent().height($this.height());
                            //var $hyper = $('')
                            $this.wrap('<a class="lightbox" rel="' + group + '" href="' + $this.attr('src') + '" style="pointer:cursor"></a>');
                            $fbs.push($this.parent());
                            $this.parent().fancybox({ 'type': 'image' });

                        }

                    });


                });
                

            });
      

           
        }

        // main board topics like business, expat info, etc
        /*$maintopiclist = $('.topiclist.forums li.row');
        $maintopiclist.each(function(i) {
            var $this = $(this);
            $a = $('a:eq(0)', $this);
            var $dt = $('<dl class="hidden collapsey" data-href="' + $a.attr('href') + '" id="collapse-' + i + '"></dl>');
            $dt = $dt.appendTo($this);
            $this.hover(function() {
              if ($this.find('.collapsey'))
                $dt.removeClass('hidden');

               $.get($this.find(".collapsey").attr("data-href"), function(data) {

                  var $topics = $(data).find('.forumbg:not(.announcement) .topiclist.topics');
                  $topics.children('li.sticky').remove();
                  $topics.children('li:gt(5)').remove();
                  $topics.find('li').css('padding-left', '20px');
                  var $topics = $($topics.html());

                  $topics.appendTo($dt);
                  $dt.removeClass('hidden');
               });
                
                
                

            }, function() {

                $dt.addClass('hidden');
                //$dt.remove();

        });


        }); */

        // individual post inside a forum
        $topiclist = $('.topiclist.topics li');




        if (items.colors.oddRow!='transparent')
            $topiclist.filter(':odd').css('background-color', items.colors.oddRow);
    
        if (items.colors.evenRow!='transparent')
            $topiclist.filter(':even').css('background-color', items.colors.evenRow);
    
      
        $postTitles = $('a[href*="viewtopic"], .postbody h3 a');

        var $get = $('<div id="getit"></div>')
        $('body').append($get);


      /*  $postTitles.each(function () {
            var $this = $(this);

            $this.popover({
                title: 'test',
                trigger: 'hover',
                content: function () {
                    $get.html($(data).find('.post').eq(0));
                },
                placement: 'top',
                html: true,
                container: 'body'

            });

        }); */
        $(document).on('focus', ':not(.popover)', function () {
            $('.popover').popover('destroy');
        });

        $postTitles.popover({

            trigger: 'manual',

            placement: 'top',
            html: true,
            container: 'body'


        });

        $postTitles.each(function () {
            var $this = $(this);
            $(this).hover(function () {
               
                $.get($this.attr('href') + "&st=0&sk=t&sd=d&sort=Go", function (data) {
                    $this.attr('title', $this.parents('.row').find('.lastpost a:eq(0)').text());
                    var data =$(data).find('.post:eq(0) .content').eq(0).text();
                    if (data.length > 300)
                        data = data.substring(0,300) + "...";

                    $this.attr('data-content', data);
                    if ($this.is(':hover'))
                        $this.popover('show');
                }
                );
            }, function () {
                
                    $this.popover('hide');
            });
            
        }); 

        $postTitles.css('color', items.colors.postTitle);

        if (items.normalizertext == 'off') return;
        switch (items.normalizertext) {
            case 'uppercase': $.fn.normalizer = function () {
                return this.each(function () {
                    var $this = $(this);
                    $this.text($this.text().toUpperCase());
                });


            };
                break;
            case 'lowercase': $.fn.normalizer = function () {
                return this.each(function () {
                    var $this = $(this);
                    $this.text($this.text().toLowerCase());
                });

            };

                break;
            case 'crazy':
                $.fn.normalizer = function () {
                    return this.each(function () {
                        var $this = $(this);
                        var s = $this.text();
                        for (i = 0, l = s.length; i < l; i++) {
                            if (Math.round(Math.random()) == 0)
                                s = setCharAt(s, i, s.charAt(i).toUpperCase());
                            else
                                s = setCharAt(s, i, s.charAt(i).toLowerCase());
                        }
                        $(this).text(s);

                    });

                };

                break;
            default:
                $.fn.normalizer = function () {
                    var wordsToIgnore = ["to", "and", "the", "it", "or", "that", "this", "for", "onto", "on", "from", "towards"],
                        minLength = 3;
                    function getWords(str) {
                        if (str !== undefined && str != null)
                            return str.match(/\S+\s*/g);
                        return "";
                    }
                    this.each(function () {
                        if (this.text.length == 0) return;
                        var words = getWords(this.text);
                        
                        $.each(words, function (i, word) {
                            // only continue if word is not in ignore list

                            if (((wordsToIgnore.indexOf($.trim(word.toLowerCase())) == -1) && $.trim(word).length >= minLength) || i == 0) {  // 
                                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
                            } else {
                                words[i] = words[i].toLowerCase();
                            }
                        });
                        $(this).text(words.join(" "))
                    });
                };


        }

        $postTitles.normalizer();




    });


//     $('.attach-image a').fancybox();

});