import Photo from 'ember-crud-example/models/photo';
import Storage from 'ember-crud-example/storage/main';

var App, model, guid;

module("Acceptances - Photo Edit", {
  setup: function(){
    App = startApp();
    model = Em.run( Photo, 'create', {
      title: "Work in progress",
      description: "This item is incomplete."
    });
    Em.run( App.storage, 'create', model );
  },
  teardown: function() {
    debugger;
    Em.run(App.storage, 'deleteDB', App.get('dbName'));
    Ember.run(App, 'destroy');
  }
});

test("required exist", function(){
  equal(Em.typeOf(storage), 'instance');
  equal(Em.typeOf(model), 'instance');
  equal(Em.typeOf(model.get('title')), 'string');
  ok( model.get('title') !== '' );
});

test("renders", function(){
  visit('/photo/%@/edit'.fmt(model.get('guid')))
    .then(function(){
      ok(find("#inputTitle").val() === 'Work in progress');
      ok(find("#textareaDescription").val() === "This item is incomplete.");
    });
});

test("discards", function(){
  guid = model.get('guid');

  visit('/photo/%@/edit'.fmt(model.get('guid')))
    .then(function(){
      equal(find('#inputTitle').val(), 'Work in progress');
    })
    .then(function(){
      return fillIn("#inputTitle", "Updated with non-sense");
    })
    .then(function(){
      return click("button:contains('Cancel')");
    })
    .then(function(){
      var stored = storage.find( Photo, guid );
      equal(Em.typeOf(stored), 'instance');
      equal(stored.get('title'), "Work in progress");
    }); 
});
