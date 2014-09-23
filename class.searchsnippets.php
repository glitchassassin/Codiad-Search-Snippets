<?php

/*
 *  Modified extension of the Filemanager class to support search preview data
 *  Extends the original Filemanager class and replaces the search() function
 *  As with init.js, this is a copy of the original function.
 */

require_once('../../components/filemanager/class.filemanager.php');

class SearchSnippets extends Filemanager {
    //////////////////////////////////////////////////////////////////
    // SEARCH
    //////////////////////////////////////////////////////////////////

    public function search(){
        if(!function_exists('shell_exec')){
            $this->status = "error";
            $this->message = "Shell_exec() Command Not Enabled.";
        }else{
            if($_GET['type'] == 1) {
                $this->path = WORKSPACE;
            }
            $input = str_replace('"' , '', $this->search_string);
            $input = preg_quote($input);
            $output = shell_exec('find -L ' . $this->path . ' -iregex  ".*' . $this->search_file_type  . '" -type f | xargs grep -i -I -n -R -H "' . $input . '"');
            $output_arr = explode("\n", $output);
            $return = array();
            $preview_lines = 5;
            foreach($output_arr as $line){
                $data = explode(":", $line);
                $da = array();
                if(count($data) > 2){
                    $da['line'] = $data[1];
                    $da['file'] = str_replace($this->path,'',$data[0]);
                    $da['result'] = str_replace($this->root, '', $data[0]);
                    $da['string'] = str_replace($data[0] . ":" . $data[1] . ':' , '', $line);
                    
                    //
                    // Modifications begin here
                    // Add preview lines
                    //
                    $result_file = file($data[0]);
                    if ($data[1] < $preview_lines/2)
                    {
                        $starting_line = 0;
                    }
                    else
                    {
                        $starting_line = intval($data[1] - $preview_lines/2);
                    }
                    for ($i = $starting_line ; $i < $starting_line + $preview_lines ; $i++)
                    {
                        $da['lines'][] = array(
                            'number' => $i+1,
                            'line' => $result_file[$i]
                        );
                    }
                    //
                    // End of modifications
                    //
                    
                    $return[] = $da;
                }
            }
            if(count($return)==0){
                $this->status = "error";
                $this->message = "No Results Returned";
            }else{
                $this->status = "success";
                $this->data = '"index":' . json_encode($return);
            }
        }
        $this->respond();
    }
}

?>