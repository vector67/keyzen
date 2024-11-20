import { get_bearer_token } from './env.js';
const LANGUAGE = 'erlang';
const LANGUAGE_FILE_ENDING = '.erl';

export function run() {
    var data = {};
    var hits_correct = 0;
    var hits_wrong = 0;
    var start_time = 0;
    var hpm = 0;
    var ratio = 0;

    const layouts={};
    layouts["colemak"] = " tnseriaodhplfuwyq;gjvmc,x.z/bk4738291056'\"!?:@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    layouts["colemak-dh"] = " tnseriaogmplfuwyq;bjvhd,c.x/zk4738291056'\"!?:@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    layouts["colemak-dhk"] = " tnseriaogkplfuwyq;bjvhd,c.x/zm4738291056'\"!?:@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    layouts["colemak-dh-matrix"] = " tnseriaogmplfuwyq;bjdhc,x.z/vk4738291056'\"!?:@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    layouts["colemak-dhk-matrix"] = " tnseriaogkplfuwyq;bjdhc,x.z/vm4738291056'\"!?:@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    layouts["qwerty"] = " fjdksla;ghrueiwoqptyvmc,x.z/bn4738291056`-=[]\\'ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}|:\"<>?";
    layouts["custom"] = " ;,./1234567890`-=[]\\'~!@#$%^&*(){}?+|_:<>?\"";

    // layouts["azerty"] = " jfkdlsmqhgyturieozpabnvcxw6758493021`-=[]\\;',./ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}|:\"<>?";
    // layouts["b�po"] = " tesirunamc,�vodpl�jbk'.qxghyf�zw6758493021`-=[]\\;/ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}|:\"<>?";
    // layouts["norman"] = " ntieosaygjkufrdlw;qbpvmcxz1234567890'\",.!?:;/@$%&#*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ~+-={}|^<>`[]\\";
    // layouts["code-es6"] = " {}',;():.>=</_-|`!?#[]\\+\"@$%&*~^";

    data.chars = layouts["colemak-dh"];
    data.consecutive = 5;
    data.word_length = 7;
    data.current_layout = "colemak-dh";
    data.custom_chars = '';

    const CUSTOM_LAYOUT = 'custom';
    const functions = {};

    $(document).ready(function() {
        if (localStorage.data != undefined) {
            load();
            if (data.current_layout == CUSTOM_LAYOUT && data.custom_chars) {
                data.chars = data.custom_chars;
            }
            render();
        }
        else {
            set_level(1);
        }
        $(document).keypress(keyHandler);

        showActiveLayoutKeyboard();
    });


    function start_stats() {
        start_time = start_time || Math.floor(new Date().getTime() / 1000);
    }

    function update_stats() {
        if (start_time) {
            var current_time = (Math.floor(new Date().getTime() / 1000));
            ratio = Math.floor(
                hits_correct / (hits_correct + hits_wrong) * 100
            );
            hpm = Math.floor(
                (hits_correct + hits_wrong) / (current_time - start_time) * 60
            );
            if (!isFinite(hpm)) { hpm = 0; }
        }
    }


    async function set_level(l) {
        data.in_a_row = {};
        for(var i = 0; i < data.chars.length; i++) {
            data.in_a_row[data.chars[i]] = data.consecutive;
        }
        data.in_a_row[data.chars[l]] = 0;
        data.level = l;
        data.word_index = 0;
        data.word_errors = {};
        data.word = await generate_word();
        data.keys_hit = "";
        save();
        render();
    }

    async function set_layout(l) {
        data.current_layout = l
        data.chars = layouts[l]
        data.in_a_row = {};
        for(var i = 0; i < data.chars.length; i++) {
            data.in_a_row[data.chars[i]] = data.consecutive;
        }
        data.word_index = 0;
        data.word_errors = {};
        data.word = await generate_word();
        data.keys_hit = "";
        save();
        render();

        showActiveLayoutKeyboard();
    }


    function keyHandler(e) {
        start_stats();

        var key = String.fromCharCode(e.which);
        if (data.chars.indexOf(key) > -1){
            e.preventDefault();
        }
        else {
            return;
        }
        data.keys_hit += key;
        if(key == data.word[data.word_index]) {
            hits_correct += 1;
            data.in_a_row[key] += 1;
            // (new Audio("click.mp3")).play();
        }
        else {
            hits_wrong += 1;
            data.in_a_row[data.word[data.word_index]] = 0;
            data.in_a_row[key] = 0;
            (new Audio("clack.mp3")).play();
            data.word_errors[data.word_index] = true;
        }
        data.word_index += 1;
        if (data.word_index >= data.word.length) {
            setTimeout(next_word, 50);
        }

        update_stats();

        render();
        save();
    }
    functions.skip_to_next_file = async () => {
        await get_repositories();
        await functions.skip_to_next_word();
    }
        
    functions.skip_to_next_word = async () => {
        data.word = await generate_word();
        data.word_index = 0;
        data.keys_hit = "";
        data.word_errors = {};
        render();
        save();
    }

    async function next_word(){
        if(get_training_chars().length == 0) {
            level_up();
        }
        data.word = await generate_word();
        data.word_index = 0;
        data.keys_hit = "";
        data.word_errors = {};
        update_stats();

        render();
        save();
    }


    function level_up() {
        if (data.level + 1 <= data.chars.length - 1) {
            (new Audio('ding.wav')).play();
        }
        const l = Math.min(data.level + 1, data.chars.length);
        set_level(l);
    }


    function save() {
        localStorage.data = JSON.stringify(data);
    }


    function load() {
        data = JSON.parse(localStorage.data);
    }


    function render() {
        //render_layout();
        //render_level();
        render_before_words();
        render_word();
        render_after_words();
        render_level_bar();
        render_rigor();
        render_stats();
        render_file_progress();
    }

    function render_layout() {
        var layouts_html = "<span id='layout'>";
        for(var layout in layouts){
            if(data.current_layout == layout){
                layouts_html += "<span style='color: #F78D1D' onclick='set_layout(\"" + layout + "\");'> "
            } else {
                layouts_html += "<span style='color: #AAA' onclick='set_layout(\"" + layout + "\");'> "
            }
            layouts_html += layout + "</span>";
        }
        layouts_html += "</span>";
        $("#layout").html('click to set layout: ' + layouts_html);
    }

    function render_level() {
        var chars = "<span id='level-chars-wrap'>";
        var level_chars = get_level_chars();
        var training_chars = get_training_chars();
        for (var c in data.chars) {
            if(training_chars.indexOf(data.chars[c]) != -1) {
                chars += "<span style='color: #F78D1D' onclick='set_level(" + c + ");'>"
            }
            else if (level_chars.indexOf(data.chars[c]) != -1) {
                chars += "<span style='color: #000' onclick='set_level(" + c + ");'>"
            }
            else {
                chars += "<span style='color: #AAA' onclick='set_level(" + c + ");'>"
            }
            if (data.chars[c] == ' ') {
                chars += "&nbsp;";
            }
            else {
                chars += data.chars[c];
            }
            chars += "</span>";
        }
        chars += "</span>";
        $("#level-chars").html('click to set level: ' + chars);

        if (data.current_layout == CUSTOM_LAYOUT) {
            $('#level-chars').append('<a id="edit-custom-chars" href="#" data-toggle="modal" data-target="#custom-chars-modal"></a>');
            $('#level-chars #edit-custom-chars').append(' (<span style="color: #f78d1d">edit</span>)');

            $editCustomCharsLink = $('#edit-custom-chars');
            $editCustomCharsLink.click(function() {
                var $customCharsModal = $('#custom-chars-modal');
                var customChars = window.data.custom_chars || window.layouts[data.current_layout];
                $customCharsModal.find('textarea').val(customChars);

                $(document).off('keypress');
            });

            $customCharsModalOkButton = $('#custom-chars-modal--ok-button');
            $customCharsModalOkButton.click(function() {
                var $customCharsModal = $('#custom-chars-modal');
                var customCharsSubmitted = $customCharsModal.find('textarea').val();
                var customCharsProccessed = customCharsSubmitted;
                $customCharsModal.modal("hide");
                window.layouts[data.current_layout] = customCharsProccessed;
                window.data.chars = customCharsProccessed;
                window.data.custom_chars = customCharsProccessed;
                render_level();
                save();

                $(document).keypress(keyHandler);
            });
        }
    }

    function render_before_words() {
        let lines = ''
        if (data.currentIndex != 0) {
            let minLine = Math.max(0, data.currentIndex - 5);
            let maxLine = data.currentIndex - 1;
            lines = "<p>" + data.currentFile.slice(minLine, maxLine).join('<br>') + "</p>";
        }
        $("#lines-before").html(lines.replaceAll(' ', '&nbsp;'));
    }
    function render_after_words() {
    }
    function render_rigor() {
        let chars = "<span id='rigor-number' onclick='inc_rigor();'>";
        chars += '' + data.consecutive;
        chars += '<span>';
        $('#rigor').html('click to set intensity: ' + chars);
    }

    function render_stats() {
        $("#stats").text([
            "raw WPM: ", hpm / 5, " ",
            "accuracy: ", ratio, "%"
        ].join(""));
    }

    function inc_rigor() {
        data.consecutive += 1;
        if (data.consecutive > 9) {
            data.consecutive = 2;
        }
        render_rigor();
    }


    function render_level_bar() {
        const training_chars = get_training_chars();
        let m;
        if(training_chars.length == 0) {
            m = data.consecutive;
        }
        else {
            m = 1e100;
            for(let c in training_chars) {
                m = Math.min(data.in_a_row[training_chars[c]], m);
            }
        }
        m = Math.floor($('#level-chars-wrap').innerWidth() * Math.min(1.0, m / data.consecutive));
        $('#next-level').css({'width': '' + m + 'px'});

    }

    function render_word() {
        var word = "";
        for (var i = 0; i < data.word.length; i++) {
            let sclass = "normalChar";
            if (i > data.word_index) {
                sclass = "normalChar";
            }
            else if (i == data.word_index) {
                sclass = "currentChar";
            }
            else if(data.word_errors[i]) {
                sclass = "errorChar";
            }
            else {
                sclass = "goodChar";
            }
            word += "<span class='" + sclass + "'>";
            if(data.word[i] == " ") {
                if (data.word_errors[i]) {
                    word += "&#9141;";
                } else {
                    word += "&nbsp;"
                }
            }
            else if(data.word[i] == "&") {
                word += "&amp;"
            }
            else {
                word += data.word[i];
            }
            word += "</span>";
        }
        var keys_hit = "<span class='keys-hit'>";
        for(var d in data.keys_hit) {
            if (data.keys_hit[d] == ' ') {
                keys_hit += "&nbsp;";
            }
            else if (data.keys_hit[d] == '&') {
                keys_hit += "&amp;";
            }
            else if (data.keys_hit[d] == '<') {
                keys_hit += '&lt;';
            } else {
                keys_hit += data.keys_hit[d];
            }
        }
        for(var i = data.word_index; i < data.word_length; i++) {
            keys_hit += "&nbsp;";
        }
        keys_hit += "</span>";
        $("#word").html(word + "<br>" + keys_hit);
    }
    data.repositories = [];
    data.currentFile = [];
    data.currentIndex = -1;

    async function get_repositories() {
        if (!data.repositories.length) {
            data.repositories = (await (await fetch(`https://api.github.com/search/repositories?q=language:${LANGUAGE}&sort=stars&order=desc`, {headers: { "Authorization" : get_bearer_token()}})).json()).items;
        }
        const repository = data.repositories[Math.floor(Math.random() * data.repositories.length)]
        const branch = await (await fetch(`${repository.url}/branches/${repository.default_branch}`, { headers: { "Authorization": get_bearer_token() }})).json();
        const tree = await (await fetch(`${branch.commit.commit.tree.url}?recursive=true`, { headers: { "Authorization": get_bearer_token()}})).json();
        const js_files = tree.tree.map((file) => ({name: file.path, url: file.url})).filter((file) => file.name.endsWith(LANGUAGE_FILE_ENDING));
        if (!js_files.length) {
            await get_repositories();
            return;
        }
        const randomFile = js_files[Math.floor(Math.random() * js_files.length)];
        console.log('randomFile', randomFile, js_files);
        const fileContent = (await (await fetch(randomFile.url, { headers: { "Authorization": get_bearer_token() }})).json()).content;
        data.currentFile = atob(fileContent).split('\n');
        data.fileName = randomFile.name;
        data.currentIndex = 0;
    }

    async function generate_word() {
        let nextLine = '';
        do {
            if (data.currentIndex == -1 || data.currentIndex >= data.currentFile.length) {
                await get_repositories();
            }
            nextLine = data.currentFile[data.currentIndex++].trim();
        } while (!nextLine && nextLine.length < 120);

        console.log('current word/line', '"' + nextLine + '"');
        data.word_length = nextLine.length;
        render_file_progress();
        return nextLine;
    //	for(var i = 0; i < data.word_length; i++) {
    //        c = choose(get_training_chars());
    //        if(c != undefined && c != word[word.length-1]) {
    //            word += c;
    //        }
    //        else {
    //            word += choose(get_level_chars());
    //        }
    //    }
        
        return word;
    }

    function render_file_progress() {
        console.log('rendering file progress',`${data.currentIndex}/${data.currentFile.length}`); 
        $("#fileProgress").html(`<span>${data.currentIndex}/${data.currentFile.length} - ${data.fileName}</span>`);
    }

    function get_level_chars() {
        return data.chars.slice(0, data.level + 1).split('');
    }

    function get_training_chars() {
        var training_chars = [];
        var level_chars = get_level_chars();
        for(var x in level_chars) {
            if (data.in_a_row[level_chars[x]] < data.consecutive) {
                training_chars.push(level_chars[x]);
            }
        }
        return training_chars;
    }

    function choose(a) {
        return a[Math.floor(Math.random() * a.length)];
    }

    function showActiveLayoutKeyboard() {
        // Hide all, then show the active.
        $('.keyboard-layout').hide();
        var currentLayout = data.current_layout;
        // Custom chars have no default layout.
        if (currentLayout != CUSTOM_LAYOUT) {
            $('.keyboard-layout[data-layout="' + currentLayout + '"]').show()
        }
    }
    return functions;
}
