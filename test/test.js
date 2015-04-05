'use strict';

/* global describe, it, before */

var fs = require('fs'),
    Promise = require('bluebird'),
    express = require('express'),
    portfinder = require('portfinder'),
    phantom = require('phantom'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    angularProxy = require('..');

chai.use(chaiAsPromised);
chai.should();

var expect = chai.expect;

describe('angular proxy server', function () {

  describe('options', function () {

    it('should raise error if omitted', function () {
    
      expect(function () {
        angularProxy(); 
      }).to.throw('options object must be given'); 

      expect(function () {
        angularProxy('options'); 
      }).to.throw('options object must be given'); 
    });
    
    it('should raise error if target is not a string', function () {

      expect(function () {
        angularProxy({}); 
      }).to.throw('options.target must be a string');
      
      expect(function () {
        angularProxy({
          target: {} 
        }); 
      }).to.throw('options.target must be a string');
    });
    
    it('should raise error if target does not start with ' + 
      'http:// or https://', function () {
     
      expect(function () {
        angularProxy({
          target: '127.0.0.1' 
        }); 
      }).to.throw('options.target must start with http:// or https://');
      
      expect(function () {
        angularProxy({
          target: 'http://127.0.0.1' 
        }); 
      }).to.not.throw('options.target must start with http:// or https://');

      expect(function () {
        angularProxy({
          target: 'https://127.0.0.1' 
        }); 
      }).to.not.throw('options.target must start with http:// or https://');
    });
    
  });

  describe('while running', function () {

    function requestTemplate(url) {
      
      return new Promise(function (resolve, reject) {
          
        phantom.create(function (ph) {
          ph.createPage(function (page) {
            page.set('onCallback', function (data) {
              ph.exit();
              resolve(data.template); 
            });
            
            page.open(url, function (status) {
              if (status !== 'success') {
                reject(new Error('page ' + url + ' open failed')); 
              }
            });
          });
        });
      });
    }

    var proxyHref = '';

    before(function (done) {
     
      var sourceHref = ''; 
      
      var getPort = Promise.promisify(portfinder.getPort, portfinder);
     
      getPort().then(function (port) {
       
        sourceHref = 'http://127.0.0.1:' + port; 
        
        // Run source static server
        var source = express();
        source.use(express.static(__dirname + '/fixtures'));
        return Promise.promisify(source.listen, source)(port);
      }).then(function () {
    
        return getPort(); 
      }).then(function (port) {
       
        proxyHref = 'http://127.0.0.1:' + port; 
        
        // Run proxy server
        var proxy = express();
        proxy.use(angularProxy({
          target: sourceHref
        }));
        return Promise.promisify(proxy.listen, proxy)(port);
      }).then(done, done);
    }); 
     
    it('should serve root template on /', function (done) {
        
      var expectedTmpl = 
        fs.readFileSync(__dirname + '/fixtures/views/root.html').toString();

      requestTemplate(proxyHref)
        .should.eventually.equal(expectedTmpl).notify(done);
    });

    it('should serve sub template on /sub', function (done) {
        
      var expectedTmpl =
        fs.readFileSync(__dirname + '/fixtures/views/sub.html').toString();
      
      requestTemplate(proxyHref + '/sub')
        .should.eventually.equal(expectedTmpl).notify(done);
    });
  });
});

