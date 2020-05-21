'use strict;'

const key = "2d4dfb9fd6414902b663c25a6c767cfa";
var params = "&help=0&play=1&qs=1&gt=0&hr=0";
var matSpace = "https://my.matterport.com/show/?m=";
var matSid = "iL4RdJqi2yK";
var iframe;
var wrapper;
var addTagBtn;
var tag;
var table_container;

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.querySelector('.showcase');
    addTagBtn = document.querySelector('.add_tag');
    importBtn = document.querySelector('.import_tags');
    exportBtn = document.querySelector('.export_tags');
    removeBtn = document.querySelector('.remove_tags');
    sidSelector = document.querySelector('#sid-input');
    table_container = document.querySelector(".scrollable");
    iframe.setAttribute('src', `${matSpace}${matSid}${params}`);
    iframe.addEventListener('load', showcaseLoader, true);

    sidSelector.setAttribute('value', matSid);

    sidSelector.addEventListener('keyup', e => {
        if(e.key === "Enter"){
            matSid = sidSelector.value;
            iframe.setAttribute('src', `${matSpace}${matSid}${params}`);
            iframe.addEventListener('load', showcaseLoader, true);
        }
    });
})


function showcaseLoader(){
    try{
        window.MP_SDK.connect(iframe, key, '3.2')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

function populateTags(tags, sort='label'){
    var curTags = document.querySelectorAll('.scrollable tbody tr')
    curTags.forEach((tag) => {
        tag.remove();
    });
    tags.forEach(addToTable);
}

function addToTable(tag){
    var elem;
    var row;
    if(table_container && table_container.children[0] && table_container.children[0].tagName == 'THEAD'){
        table_container = table_container.appendChild(document.createElement('TBODY'));
    }

    table_container.appendChild(row = document.createElement('tr'));
    row.setAttribute('id', `${tag.sid}`);

    // Label
    row.appendChild(elem = document.createElement('td'));
    elem.setAttribute('id', 'label')
    elem.innerText = `${tag.label}`;

    // Description
    row.appendChild(elem = document.createElement('td'));
    elem.setAttribute('id', 'description')
    elem.innerText = `${tag.description}`;

    // Color
    row.appendChild(elem = document.createElement('td'));
    elem.setAttribute('id', 'color')
    elem.appendChild(elem = document.createElement('div'));
    elem.setAttribute('style', `background-color: rgb(${tag.color.r * 255}, ${tag.color.g * 255}, ${tag.color.b * 255});`);

    // Goto link
    row.appendChild(elem = document.createElement('td'));
    elem.setAttribute('id', 'goto');
    elem.appendChild(document.createElement('div'));

    // Delete
    row.appendChild(elem = document.createElement('td'));
    elem.setAttribute('id', 'icon');
    elem.appendChild(document.createElement('div'));

    return row;
}

function loadedShowcaseHandler(mpSdk){
    var addingTag = false;
    var movingTag = false;
    // Fetch tags
    mpSdk.Mattertag.getData()
    .then( (tags) => {
        mattertags = tags;
        populateTags(tags);
        setupTagFunctionality();
    })
    .catch(console.error);

    function placeTag(){
        if(tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.INSTANT);
        tag = null;
        movingTag = false;
    }

    var eventListener = window.addEventListener('blur', function() {
        if (document.activeElement === iframe) {
            placeTag(); //function you want to call on click
            setTimeout(function(){ window.focus(); }, 0);
        }
        window.removeEventListener('blur', eventListener );
    });

    mpSdk.Pointer.intersection.subscribe(intersectionData => {
        if(tag && !movingTag){
            if(intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep'){
                let scale = .33;
                mpSdk.Mattertag.editPosition(tag, {
                    anchorPosition: intersectionData.position,
                    stemVector: {
                        x: scale * intersectionData.normal.x,
                        y: scale * intersectionData.normal.y,
                        z: scale * intersectionData.normal.z,
                    }
                })
                .catch(e =>{
                    console.error(e);
                    tag = null;
                    movingTag = false;
                });
            }
        }
    });

    addTagBtn.addEventListener('click', () => {
        if(!addingTag && !tag){
            addingTag = true;
            mpSdk.Mattertag.add([{
                label: "Matterport Tag",
                description: "",
                anchorPosition: {x: 0, y: 0, z: 0},
                stemVector: {x:0, y: 0, z: 0},
                color: {r: 1, g: 0, b: 0},
            }])
            .then((sid) => {
                tag = sid[0];
                return mpSdk.Mattertag.getData()
            })
            .then( (collection) => {
                var t_sid = collection.find( elem => elem.sid === tag);
                var row = addToTable(t_sid);
                addTagListeners(row);
                addingTag = false;
            })
            .catch( (e) => {
                console.error(e);
                addingTag = false;
            })
        }
    });

    function replaceShowcaseTags(tags){
        return mpSdk.Mattertag.getData()
        .then(oldTags => {
            oldTagSids = oldTags.map(oldTag => oldTag.sid);
            return mpSdk.Mattertag.remove(oldTagSids);
        })
        .then( () => {
            return mpSdk.Mattertag.add(tags);
        })
        .then(newSids => {
            tags.forEach( (tag, i) => tag.sid = newSids[i]);
            return tags;
        })
        .catch(e  => {
            console.error(`${e}: ${tags}`);
        });
    }

    importBtn.addEventListener('click', () => {
        var input = document.createElement('input');
        input.type = 'file';
        var file;
        input.onchange = e => {
            file = e.target.files[0];
            importFile(file);
        }
        setTimeout( () => {input.click();}, 100);
    });

    removeBtn.addEventListener('click', () => {
        removeAllTags();
    })

    function importFile(file){
        if(file.type === "application/json"){
            var reader = new FileReader();
            reader.readAsText(file);

            reader.addEventListener('load', e => {
                var content = e.target.result;
                tags = JSON.parse(content);
                replaceShowcaseTags(tags)
                .then((newTags) => {
                    populateTags(newTags);
                    setupTagFunctionality();
                })
                .catch(console.error);
            });
        }else{
            window.alert("Please select a .json filetype");
        }
    }

    // from https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    function removeAllTags(){
        mpSdk.Mattertag.getData()
        .then(tags => {
            return tags.map(tag => tag.sid);
        })
        .then(tagSids => {
            return mpSdk.Mattertag.remove(tagSids)
        })
        .catch(console.error);

        document.querySelectorAll('tr').forEach( block =>{
            if(!block || block.children[0].tagName == 'TH') return;
            block.parentNode.removeChild(block);
        });
    }

    function exportTags(tags){
        if(!tags || tags.length == 0){return;} // TODO: Let the user know there are no tags
        var filename = 'tags.json';
        var tagsText = JSON.stringify(tags);
        download(tagsText, filename, "application/json");
    }

    exportBtn.addEventListener('click', () => {
        mpSdk.Mattertag.getData()
        .then(exportTags);
    });

    function updateTag(matTagId, label=null, description=null){
        if(!label && !description) return;

        var props = new Object();
        label ? props['label'] = label : {};
        description ? props['description'] = description : {};

        mpSdk.Mattertag.editBillboard(matTagId, props)
        .catch( (e) => { console.error(e); });
    }

    function changeInfo(ele, tagId){
        if(ele.tagName === 'TH'){ return; }
        var desc = ele.innerText;
        var change = document.createElement('input');
        change.id = tagId;
        change.value = desc;
        ele.replaceWith(change);
        change.focus();
        change.addEventListener('blur', () => {
            clickAway(change, tagId);
        });
        change.addEventListener('keydown', (e) => {
            if(e.key == "Enter"){
                change.blur();
            }
        });
    }

    function clickAway(ele, tagId) {
        var desc = ele.value;
        var change = document.createElement('td');
        change.id = tagId;
        change.innerText = desc;
        ele.replaceWith(change);
        change.removeEventListener('blur', clickAway);
        var lbl = tagId === 'label' ? desc : null;
        var desc = tagId === 'description' ? desc : null;
        updateTag(change.parentElement.id, label=lbl, description=desc);
        change.addEventListener('click', () =>{
            changeInfo(change, tagId);
        });
    };

    function addTagListeners(block){
        if(!block || block.children[0].tagName == 'TH'){ return; }
        // Label
        block.children[0].addEventListener('click', () => {
            changeInfo(block.children[0], tagId='label');
        });

        // Description
        block.children[1].addEventListener('click', () => {
            changeInfo(block.children[1], tagId='description');
        });

        // arrow icon
        block.children[3].addEventListener('click', () => {
            mpSdk.Mattertag.navigateToTag(block.id, mpSdk.Mattertag.Transition.FADEOUT)
            .catch((e) => { console.error(e); });
        });
    
        // delete icon
        block.children[4].addEventListener('click', () => {
            block.parentNode.removeChild(block);
            mpSdk.Mattertag.remove(block.id)
            .catch((e) => { console.log(e); });
        });
    }
    
    function setupTagFunctionality(){
        document.querySelectorAll('tr').forEach(addTagListeners);
    }

} // loadedShowcaseHandler
