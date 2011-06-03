//
//        Copyright 2010 Hydna AB. All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conds
//  are met:
//
//    1. Redistributions of source code must retain the above copyright
//       notice, this list of conds and the following disclaimer.
//
//    2. Redistributions in binary form must reproduce the above copyright
//       notice, this list of conds and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY HYDNA AB ``AS IS'' AND ANY EXPRESS OR IMPLIED
//  WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
//  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
//  EVENT SHALL HYDNA AB OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
//  USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
//  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
//  TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//  The views and conclusions contained in the software and documentation are
//  those of the authors and should not be interpreted as representing
//  official policies, either expressed or implied, of Hydna AB.
//


function HydnaConsole(domain, opts) {
  var self = this;
  var readycount = 0;
  var channel;
  var token;
  var uri;

  if (typeof HydnaStream !== "function") {
    throw new Error("HydnaConsole requires hydna.js");
  }

  if (typeof domain !== "string") {
    throw new Error("bad argument, `domain`, expected String");
  }

  function onopen() {
    readycount--;
    if (readycount == 0) {
      self.onopen && self.onopen.call(this);
    }
  }

  function onmessage(data) {
    var type = "info";

    switch (this) {
      case self.debugStream: type = "debug"; break;
      case self.infoStream: type = "info"; break;
      case self.errorStream: type = "error"; break;
    }

    self.onmessage && self.onmessage.call(this, type, data);
  }

  function onerror(err) {
    self.onerror && self.onerror(err);
  }

  opts = opts || {};

  if ("disableDebug" in opts == false) {
    channel = opts.debugChannel || 0xFFFFFFF0;
    token = opts.debugToken || opts.token || null;
    uri = domain + "/" + channel + (token ? "?" + token : ""); 
    this.debugStream = new HydnaStream(uri, "r");
    this.debugStream.onopen = onopen;
    this.debugStream.onmessage = onmessage;
    this.debugStream.onerror = onerror;
    readycount++;
  }

  if ("disableInfo" in opts == false) {
    channel = opts.infoChannel || 0xFFFFFFF1;
    token = opts.infoToken || opts.token || null;
    uri = domain + "/" + channel + (token ? "?" + token : ""); 
    this.infoStream = new HydnaStream(uri, "r");
    this.infoStream.onopen = onopen;
    this.infoStream.onmessage = onmessage;
    this.infoStream.onerror = onerror;
    readycount++;
  }

  if ("disableError" in opts == false) {
    channel = opts.errorChannel || 0xFFFFFFF2;
    token = opts.errorToken || opts.token || null;
    uri = domain + "/" + channel + (token ? "?" + token : ""); 
    this.errorStream = new HydnaStream(uri, "r");
    this.errorStream.onopen = onopen;
    this.errorStream.onmessage = onmessage;
    this.errorStream.onerror = onerror;
    readycount++;
  }

}

HydnaConsole.prototype.close = function() {

  if (this.debugStream) {
    this.debugStream.close();
    this.debugStream = null;
  }

  if (this.infoStream) {
    this.infoStream.close();
    this.infoStream = null;
  }
  
  if (this.errorStream) {
    this.errorStream.close();
    this.errorStream = null;
  }

  this.onclose && this.onclose.call(this);
};