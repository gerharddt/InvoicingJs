// Generated by CoffeeScript 1.6.2
(function() {
  var Client, Company, Item, client, company;

  Item = (function() {
    function Item(qty, description, unit_price, css, id) {
      this.qty = qty;
      this.description = description;
      this.unit_price = unit_price;
      this.css = css;
      this.id = id;
      this.amount = parseFloat(this.round(this.qty * this.unit_price));
    }

    Item.prototype.round = function(amount) {
      return amount.toFixed(2);
    };

    Item.prototype.amount = function() {
      return this.amount = parseFloat(this.round(this.qty * this.unit_price));
    };

    return Item;

  })();

  Client = (function() {
    function Client(name, address, city_state_zip, phone) {
      this.name = name;
      this.address = address;
      this.city_state_zip = city_state_zip;
      this.phone = phone;
    }

    return Client;

  })();

  Company = (function() {
    function Company(name, address, phone) {
      this.name = name;
      this.address = address;
      this.phone = phone;
    }

    return Company;

  })();

  client = JSON.parse(localStorage.getItem('invoiceClient')) || new Client("Coyote", "1 Road Runner rd.", "Address Line 2", "416-123-4567");

  company = JSON.parse(localStorage.getItem('invoiceCompany')) || new Company("Company Name", "Company Address line 1\nCompany Address Line 2\nCity, State, Zip", "416-000-0000");

  window.Invoice = angular.module('Invoice', []);

  window.Invoice.controller('InvoiceCtrl', function($scope) {
    $scope.items = JSON.parse(localStorage.getItem('invoiceItems')) || [new Item(1, "Acme Bird Seed", 13.25, '', 0)];
    $scope.autoincrement = parseInt(localStorage.getItem('autoincrement'));
    $scope.company = company;
    $scope.client = client;
    $scope.date = new Date().toLocaleDateString();
    $scope.number = (Math.random() * 100).toFixed(0);
    $scope.freight = 0;
    $scope.fields = JSON.parse(localStorage.getItem('invoiceFields')) || [];
    $scope.addField = function() {
      return $scope.fields.push({
        name: '',
        value: '',
        symbol: '',
        css: 'dontPrint'
      });
    };
    $scope.addItem = function() {
      var item;

      item = new Item('', '', '', 'dontPrint');
      item.id = $scope.autoincrement;
      $scope.items.push(item);
      $scope.itemsObject.items.push(item);
      ++$scope.autoincrement;
      return localStorage.autoincrement = $scope.autoincrement;
    };
    $scope.removeItem = function(item) {
      var i;

      i = $scope.items.indexOf(item);
      if (i !== -1) {
        return $scope.items.splice(i, 1);
      }
    };
    $scope.removeField = function(field) {
      var i;

      i = $scope.fields.indexOf(field);
      console.log(i);
      if (i !== -1) {
        return $scope.fields.splice(i, 1);
      }
    };
    $scope.updateSubtotal = function() {
      var item, sum, _i, _len, _ref;

      sum = 0;
      _ref = $scope.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.qty === '0' || item.qty === '') {
          item.css = 'dontPrint';
        } else {
          item.css = '';
        }
        sum += parseFloat(item.qty * item.unit_price);
      }
      return sum;
    };
    $scope.subtotal = $scope.updateSubtotal();
    $scope.$watch('items', function() {
      $scope.subtotal = $scope.updateSubtotal();
      $scope.total = $scope.updateTotal();
      return localStorage.invoiceItems = JSON.stringify($scope.items);
    }, true);
    $scope.$watch('fields', function() {
      $scope.total = $scope.updateTotal();
      return localStorage.invoiceFields = JSON.stringify($scope.fields);
    }, true);
    $scope.$watch('company', function() {
      return localStorage.invoiceCompany = JSON.stringify($scope.company);
    });
    $scope.$watch('client', function() {
      return localStorage.invoiceClient = JSON.stringify($scope.client);
    });
    $scope.parseFields = function() {
      var field, v, _i, _len, _ref, _results;

      _ref = $scope.fields;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        v = field.value;
        if (v === '') {
          field.css = 'dontPrint';
        } else {
          field.css = '';
        }
        if (v[0] === "$" || v[0] === '€' || v[0] === '£') {
          _results.push(field.symbol = 'currency');
        } else if (v[v.length - 1] === "%") {
          _results.push(field.symbol = '%');
        } else {
          _results.push(field.symbol = '');
        }
      }
      return _results;
    };
    $scope.updateTotal = function() {
      var field, t, _i, _len, _ref;

      t = $scope.subtotal;
      $scope.parseFields();
      _ref = $scope.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field.value !== '') {
          if (field.symbol === '%') {
            t += t * parseFloat(parseFloat(field.value)) / 100;
          } else if (field.symbol === 'currency') {
            t += parseFloat(field.value.substring(1));
          } else {
            t += parseFloat(field.value);
          }
        }
      }
      return t;
    };
    $scope.total = $scope.updateTotal();
  });

}).call(this);
