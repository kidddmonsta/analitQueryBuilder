$(function () {
  DevExpress.localization.locale(navigator.language);

  var dbOptionsForm, saveButton, dataSourceData = null;

  var dbFields = {
    "name": "Название коннектора",
    "sourceType": "postgres",
    "rawConnectionString": "user=имя_пользователя password=пароль dbname=название_бд sslmode=disable host=хост"
  };
  dbOptionsForm = $("#settings-form").dxForm({
    formData: dbFields,
    readOnly: false,
    showColonAfterLabel: true,
    labelLocation: "top",
    minColWidth: 300,
    colCount: 1
  }).dxForm("instance");

  var getData = function () {
    var data = dbOptionsForm.option("formData");
    return data;
  };

  var createConnection = function (query) {
    console.log('create');
    $.post(IP_TO_DATA_SOURCE_CORE, JSON.stringify(query), function (dataSource) {
      console.log(dataSource);
      dataSourceData = dataSource;
      $("#CRUD-result").html('<h3>Источник данных:</h3><p>' + JSON.stringify(dataSource) + "</p>");
    });
  };
  var updateConnection = function (query) {
    console.log('update');
    $.ajax({
      type: 'PATCH',
      url: IP_TO_DATA_SOURCE_CORE + "/" + dataSourceData.id,
      data: JSON.stringify(query),
      processData: false,
      contentType: 'application/merge-patch+json',
    }).done(function (data) {
      console.log(data);
      dataSourceData = data;
      $("#CRUD-result").html('<h3>Обновленный источник данных</h3><p>' + JSON.stringify(data) + "</p>");
    });
  };
  saveButton = $("#save-connection").dxButton({
    text: "Сохранить",
    onClick: function () {
      var query = getData();
      console.log(query);
      if (dataSourceData == null) {
        createConnection(query);
      } else {
        updateConnection(query);
      }
      console.log('saved');
    }
  }).dxButton("instance");


});
