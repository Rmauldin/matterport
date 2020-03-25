'use strict;'

const key = "fe2587b5509f46949a166ee38ec362b6";
var params = "&help=0&hl=2&play=1&qs=1";
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
    overlay = document.querySelector('.showcase_overlay');
    sidSelector = document.querySelector('.sid_selector');
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
    // TODO: implement sorting and description link extraction
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

    // For demo =======================
    // var demoTags = [{"sid":"mdbCLNQre7k","label":"Sportwear Sport Pack Collection","description":"$79.99","parsedDescription":[{"type":"text","text":"$79.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.544976748299657,"y":1.2477712102247804,"z":5.535865467895027},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":1,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"oYgirbi6bd9","label":"Dri-Fit Studio Tank","description":"$44.99","parsedDescription":[{"type":"text","text":"$44.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.601153512205248,"y":5.807148124517412,"z":17.37511776219953},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":1,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"ImRDywN7y72","label":"Miler Tank Hybrid","description":"$39.99","parsedDescription":[{"type":"text","text":"$39.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.6296264334612935,"y":6.199278694984552,"z":21.177519948964555},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":1,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"NsjuXOWkkFt","label":"Air Jordans","description":"$119.99","parsedDescription":[{"type":"text","text":"$119.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.796979390771295,"y":-2.4226375721398377,"z":17.60085984720765},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":0,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"KIgr3qqf6CH","label":"Dry-Fit Breathe Camo Top","description":"$49.99","parsedDescription":[{"type":"text","text":"$49.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.481041746307972,"y":-1.8027192393781701,"z":11.623058721224254},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":0,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"v2IeKX3mqRF","label":"Young Athlete Shoes","description":"$79.99","parsedDescription":[{"type":"text","text":"$79.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":2.3517083397243703,"y":-3.4143103143645686,"z":-1.2565219983590263},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":0,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"ButSIos02RM","label":"Phenom Pants","description":"$89.99","parsedDescription":[{"type":"text","text":"$89.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.599833407729863,"y":1.1236514258572265,"z":18.646373663953135},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":1,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true},{"sid":"WbgFT5FROxI","label":"Dri-Fit Squad Pant","description":"$99.99","parsedDescription":[{"type":"text","text":"$99.99"}],"mediaSrc":"","mediaType":"none","media":{"type":"none","src":""},"anchorPosition":{"x":-6.566484982894435,"y":-2.1350717353686455,"z":8.50362124874894},"anchorNormal":{"x":0,"y":1,"z":0},"color":{"r":1,"g":0,"b":0},"enabled":true,"floorIndex":0,"stemVector":{"x":0,"y":0.2,"z":0},"stemVisible":true}] 
    
    // replaceShowcaseTags(demoTags)
    // .then((newTags) => {
    //     populateTags(newTags);
    //     setupTagFunctionality();
    // })
    // .catch(console.error);
    // =====================

    overlay.addEventListener('mousemove', (e) => {
        // console.log(`x: ${e.clientX} y: ${e.clientY}`);
        if(tag && !movingTag){
            movingTag = true;
            mpSdk.Renderer.getWorldPositionData({x: e.offsetX, y: e.offsetY})
            .then((worldData) => {
                if(!worldData.position){
                    return mpSdk.Renderer.getWorldPositionData({x: e.offsetX, y: e.offsetY});
                }
                return worldData;
            })
            .then((worldData) => {
                if(!worldData.position){
                    return mpSdk.Renderer.getWorldPositionData({x: e.offsetX, y: e.offsetY});
                }
                return worldData;
            })
            .then((worldData) => {
                if(!worldData.position){
                    return mpSdk.Renderer.getWorldPositionData({x: e.offsetX, y: e.offsetY});
                }
                return worldData;
            })
            .then((worldData) => {
                if(!worldData.position){
                    return mpSdk.Renderer.getWorldPositionData({x: e.offsetX, y: e.offsetY}, .2);
                }
                return worldData;
            })
            .then( worldData => {
                if(!worldData.position){
                    worldData.position = {x: 0, y: 0, z: 0}
                }
                return mpSdk.Mattertag.editPosition(tag, {
                    anchorPosition: worldData.position,
                    stemVector: {x: 0, y: 0.2, z: 0}
                });
            })
            .then( () => {
                movingTag = false;
            })
            .catch((e) => {
                console.error(e);
                tag = null;
                movingTag = false;
            });
        }
    });

    overlay.addEventListener('click', (e) => {
        tag = null;
        overlay.setAttribute('style', 'display: none;');
    });

    addTagBtn.addEventListener('click', () => {
        overlay.setAttribute('style', 'display: inherit;');
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

    function extractColors(rgb){
        var re = /background-color: rgb\((.*)\)/;
        var colors = rgb.match(re);
        colors = colors[1].split(',');
        colors = colors.map( color => parseInt(color.trim()) );

        return Object({
            r: colors[0], 
            g: colors[1], 
            b: colors[2]
        });
    }

    function configureColorSliderElement(parent, defaultColorValue){
        var slider;
        parent.appendChild(slider = document.createElement('input'));
        slider.setAttribute('type', 'range');
        slider.setAttribute('max', 255);
        slider.setAttribute('min', 0);
        slider.setAttribute('value', defaultColorValue);
    }

    function changeColor(block){
        colorDiv = block.children[0];
        var colors = extractColors(colorDiv.getAttribute('style'));
        var picker = document.createElement('div');
        picker.setAttribute('class', 'color_picker');

        Object.values(colors).forEach(color => {
            configureColorSliderElement(picker, color);
        });
        console.log(picker);

        // why won't you blur?
        picker.addEventListener('blur', () => {
            console.warn("BLURRED");
            newColor = document.createElement('div');
            newColor.setAttribute('background-color', `rgb(${picker.children[0]}, ${picker.children[1]}, ${picker.children[2]})`);
            picker.replaceWith(newColor);
        });

        colorDiv.replaceWith(picker);
    }

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
