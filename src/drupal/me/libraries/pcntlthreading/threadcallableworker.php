<?php
namespace PcntlThreading;

/**
 * PcntlThreadCallbackWorker Class.
 *
 * @author Tasior
 */
class ThreadCallableWorker extends ThreadWorker{
    
    private $_callback;
    private $_arguments;
    
    /**
     * Constructor.
     * 
     * @param callable $callable
     * @param array $arguments
     */
    public function __construct(callable $callable, array $arguments = array()) {
        $this->_callback = $callable;
        $this->_arguments = $arguments;
    }
    
    /**
     * Run function.
     */
    protected function run() {
        call_user_func_array($this->_callback, $this->_arguments);
    }
    
}

?>
