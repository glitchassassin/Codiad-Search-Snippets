/*
 *  Extended Search Results
 *  Codiad Plugin
 *  Copyright 2014 Glitch Assassin
 */

(function(global, $){
    
    // Define core
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    // Instantiates plugin
    $(function() {
        codiad.searchsnippets.init();
    });

    codiad.searchsnippets = {
        // Allows relative `this.path` linkage
        path: curpath,
        init: function() {
        	
        	//
        	// Swap in replacement Search function
        	//
        	codiad.filemanager.search = this.search;
        },
        
        //
        // Modified replacement Search function - nothing changed except as noted
        // Due to the way the code is structured, modifying search results requires
        // copying & replacing the whole function.
        //
        search: function(path) {
            var dialog = curpath+'dialog.php',
                controller = curpath+'controller.php';
            codiad.modal.load(500, dialog,{
                action: 'search',
                path: path
            });
            codiad.modal.load_process.done( function() {
                var lastSearched = JSON.parse(localStorage.getItem("lastSearched"));
                if(lastSearched) {
                    $('#modal-content form input[name="search_string"]').val(lastSearched.searchText);
                    $('#modal-content form input[name="search_file_type"]').val(lastSearched.fileExtension);
                    $('#modal-content form select[name="search_type"]').val(lastSearched.searchType);
                    if(lastSearched.searchResults !== '') {
                      $('#filemanager-search-results').slideDown().html(lastSearched.searchResults);
                    }
                }
            });
            codiad.modal.hideOverlay();
            var _this = this;
            $('#modal-content form')
                .live('submit', function(e) {
                $('#filemanager-search-processing')
                    .show();
                e.preventDefault();
                searchString = $('#modal-content form input[name="search_string"]')
                    .val();
                fileExtensions=$('#modal-content form input[name="search_file_type"]')
                     .val();
                searchFileType=$.trim(fileExtensions);
                if (searchFileType !== '') {
                    //season the string to use in find command
                    searchFileType = "\\(" + searchFileType.replace(/\s+/g, "\\|") + "\\)";
                }
                searchType = $('#modal-content form select[name="search_type"]')
                    .val();
                $.post(controller + '?action=search&path=' + path + '&type=' + searchType, {
                    search_string: searchString,
                    search_file_type: searchFileType
                }, function(data) {
                    searchResponse = codiad.jsend.parse(data);
                    var results = '';
                    if (searchResponse != 'error') {
                    	//
                    	// This is the bit that's changed.
                    	// We've modified the display format and layout,
                    	// and added code to display the preview lines.
                    	//
                        $.each(searchResponse.index, function(key, val) {
                            // Cleanup file format
                            val['file'] = val['file'].replace('//','/');
                            if(val['file'].substr(-1) == '/') {
                                val['file'] = val['file'].substr(0, str.length - 1);
                            }
                            if(val['file'].substr(0,1) == '/') {
                                val['file'] = val['file'].substr(1);
                            }
                            // Add result
                            results += '<a style="cursor: pointer;" onclick="codiad.filemanager.openFile(\'' + val['result'] + '\');setTimeout( function() { codiad.active.gotoLine(' + val['line'] + '); }, 500);codiad.modal.unload();"><div>\n';
                            results += '<span style="color: #FACC2E">' + val['file'] + ':' + val['line'] + '</span><br/>'
                            for (var n = 0; n < val['lines'].length; n++)
                            {
                            	line_target = false;
                            	if (val['lines'][n]['number'] == val['line']) 
                            	{ 
                            		line_target = true;
                            		results += '<span style="color: #8258FA">';
                            	}
                            	else
                            	{
                            		results += '<span style="color: #A9A9F5">';
                            	}
                            	results += val['lines'][n]['number'] 
                            			+  (line_target ? ':'+new Array(5 - val['lines'][n]['number'].toString().length).join("&nbsp;") : ''+new Array(6 - val['lines'][n]['number'].toString().length).join("&nbsp;")) 
                            			+  '</span>' 
                            			+  $("<div>").text(val['lines'][n]['line']).html() + '<br/>\n';
                            }
                            results += '</div></a>\n';
                        });
                        //
                        // End of changes.
                        //
                        $('#filemanager-search-results')
                            .slideDown()
                            .html(results);
                    } else {
                        $('#filemanager-search-results')
                            .slideUp();
                    }
                    _this.saveSearchResults(searchString, searchType, fileExtensions, results);
                    $('#filemanager-search-processing')
                        .hide();
                });
            });
        }
    };
    
    

})(this, jQuery);