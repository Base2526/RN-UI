<?php

namespace PcntlThreading;

/**
 * 
 * @author Jacek Górka <jacek.gorka2@gmail.com>
 * @todo Write documentation
 */
class Thread {

    private $_processId = 0;
    private $_parentId = 0;
    private $_worker = null;

    public function __construct(ThreadWorker $worker = null) {
        $this->_worker = $worker;
    }

    protected function run() {
        if ($this->_worker) {
            $this->_worker->invoke();
        }
    }

    final public function start() {
        $this->_processId = pcntl_fork();

        if ($this->_processId == -1) {
            throw new ThreadStartException();
        } else if ($this->_processId) {
            $this->_parentId = posix_getpid();
            return;
        } else {
            $this->run();
            exit;
        }
    }

    final public function stop() {
        posix_kill($this->_processId, SIGTERM);
    }

    final public function abort() {
        posix_kill($this->_processId, SIGKILL);
    }

    final public function suspend() {
        posix_kill($this->_processId, SIGSTOP);
    }

    final public function resume() {
        posix_kill($this->_processId, SIGCONT);
    }

    final public function join() {
        pcntl_waitpid($this->_processId, $status); //pcntl_wait($status = 0);
        return pcntl_wexitstatus($status);
    }

    final public function isAlive() {
        return (pcntl_waitpid($this->_processId, $status, WNOHANG) === 0);
    }

    final public function getProcessId() {
        return $this->_processId;
    }

    final public function getParentId() {
        return $this->_parentId;
    }

}
