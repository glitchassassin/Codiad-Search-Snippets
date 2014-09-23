<?php

/*
 *  Modified version of the Filemanager search dialog
 */

require_once('../../common.php');
require_once('../../components/filemanager/class.filemanager.php');

//////////////////////////////////////////////////////////////////
// Verify Session or Key
//////////////////////////////////////////////////////////////////

checkSession();

?>
<form>
    <input type="hidden" name="path" value="<?php echo($_GET['path']); ?>">
    <table class="file-search-table">
        <tr>
            <td width="65%">
               <label><?php i18n("Search Files:"); ?></label>
               <input type="text" name="search_string" autofocus="autofocus">
            </td>
            <td width="5%">&nbsp;&nbsp;</td>
            <td>
                <label><?php i18n("In:"); ?></label>
                <select name="search_type">
                    <option value="0"><?php i18n("Current Project"); ?></option>
                    <?php if(checkAccess()) { ?>
                    <option value="1"><?php i18n("Workspace Projects"); ?></option>
                    <?php } ?>
                </select>
            </td>
        </tr>
        <tr>
            <td width="65%">
               <label><?php i18n("File Type:"); ?></label>
               <input type="text" name="search_file_type" placeholder="space seperated file types eg: js c php">
            </td>
            <td>
            </td>
        </tr>
    </table>
    <pre style="width: 454px; overflow: auto;" id="filemanager-search-results"></pre>
    <div id="filemanager-search-processing"></div>
    <button class="btn-left"><?php i18n("Search"); ?></button>
	<button class="btn-right" onclick="codiad.modal.unload();return false;"><?php i18n("Cancel"); ?></button>
</form>