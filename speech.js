/*
 *         \    
 *  __/|  \ \   
 * |__ | | | |  
 *    \|  / /   
 *         /    
 * SPEECH.js
 *
 * @version 1.0
 * @author Wouter J <http://wouterj.nl>
 * @license MIT
 */
!function() {

    var Speech = function(elem) {
        if (elem.nodeName) {
            this.elem = elem;
        } else {
            this.elem = document.querySelector(elem);
        }

        if (!this.elem.hasAttribute('x-webkit-speech')) {
            this.elem.setAttribute('x-webkit-speech', 'x-webkit-speech');
        }

        this.action.elem = this.elem;
        this.action.self = this;
    };

    Speech.isSupported = (function() {
        return !('webkitSpeech' in document.createElement('input'));
    })();

    Speech.fn = {
        stripWhiteSpace : function(txt) {
                              return txt.replace(/ /g, '');
                          }
    };

    Speech.prototype = {
        gotos : {},
        sentences: {},

        action : {
            goTo : function(name, url) {
                       if (undefined === url && typeof name == 'object') {
                           // handle ({ foo : 'bar', bar : 'baz', ...})
                           for (i in name) {
                               this.self.gotos[i] = name[i];
                           }
                       } else if (undefined !== url) {
                           // handle ('foo', 'bar')
                           this.self.gotos[name] = url;
                       }
                   },

            sentence : function(sentence, url) {
                           if (undefined === url && typeof sentence == 'object') {
                               // handle ({ foo : 'bar', bar : 'baz', ...})
                               for (i in sentence) {
                                   this.self.sentences[i] = sentence[i];
                               }
                           } else if (undefined !== url) {
                               // handle ('foo', 'bar')
                               this.self.sentences[sentence] = url;
                           }
                       }
        },

        call : function() {
                   this.callGoTo();
                   this.callSentence();
               },

        callGoTo : function() {
                       txt = this.elem.value;
                       
                       if (txt.match('(ga|go)')) {
                           for (i in this.gotos) {
                               if (txt.match(i)) {
                                   window.location = this.gotos[i];
                                   break;
                               }
                           }
                       }
                   },

        callSentence : function() {
                           txt = this.elem.value;

                           for (i in this.sentences) {
                               if (null !== (vars = txt.match(i))) {
                                   if (vars.length > 1) {
                                       // placeholders
                                       loc = this.sentences[i];
                                       x = 1;
                                       for (j=0; placeholder = vars[++j]; ) {
                                           loc = loc.replace('$' + x++, placeholder);
                                       }
                                   }

                                   window.location = loc || this.questions[i];
                                   break;
                               }
                           }
                       }
    };

    window.Speech = Speech;

}();
