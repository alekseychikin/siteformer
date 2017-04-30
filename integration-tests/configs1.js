var chai = require('chai')

chai.should()

var TIMEOUT_FOR_SEND = 300

describe('Configs page', function () {
  it('should exists', function () {
    browser.url('http://localhost:3000/cms/configs')
    browser.getTitle().should.be.equal('Настройки')
  })

  it ('open add section page', function () {
    browser.url('http://localhost:3000/cms/configs')
    browser.click('a[href="/cms/configs/add/"]')
    browser.getTitle().should.be.equal('Добавить раздел')
  })

  it ('create section with string type', function () {
    browser.url('http://localhost:3000/cms/configs/add/')
    browser.getTitle().should.be.equal('Добавить раздел')
    browser.setValue('#title', 'Раздел строки')
    browser.setValue('#alias', 'string-section')
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]', 'Поле для строки')
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]', 'string')
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.getTitle().should.be.equal('Редактировать раздел «Раздел строки»')
  })

  it ('show error messages', function () {
    browser.url('http://localhost:3000/cms/configs/add/')

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="configs-add-title"] ~ .form__error').should.be.true
    browser.getText('[data-role="configs-add-title"] ~ .form__error').should.be.equal('Поле обязательно к заполнению')

    browser.setValue('#title', 'Раздел строки')
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="configs-add-title"] ~ .form__error').should.be.true
    browser.getText('[data-role="configs-add-title"] ~ .form__error').should.be.equal('Раздел с таким именем уже есть, придумайте другое')

    browser.setValue('#title', 'Раздел новый')
    browser.isExisting('[data-role="configs-add-title"] ~ .form__error').should.be.false
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="configs-add-alias"] ~ .form__error').should.be.equal('Поле обязательно к заполнению')

    browser.setValue('#alias', 'string-section')
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.false
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="configs-add-alias"] ~ .form__error').should.be.equal('Раздел с таким веб-именем уже есть, придумайте другое')

    browser.setValue('#alias', 'Что ещё не так?')
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.false
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="configs-add-alias"] ~ .form__error').should.be.equal('Веб-имя может состоять только из символов латинского алфавита, дефис и подчеркивания')

    browser.setValue('#alias', 'new-one')
    browser.isExisting('[data-role="configs-add-alias"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"] ~ .form__error')
      .should.be.equal('Поле обязательно к заполнению')

    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]', 'Заголовок к полю')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error')
      .should.be.equal('Поле обязательно к заполнению')

    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]', 'Алиас к полю')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error')
      .should.be.equal('Веб-имя может состоять только из символов латинского алфавита, дефис и подчеркивания')

    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]', 'alias-to-field')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"] ~ .form__error').should.be.false

    browser.click('[data-role="btn-add-field"]')
    browser.elements('[data-role="row-module-fields"]').value.length.should.be.equal(2)

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error')
      .should.be.equal('Поле обязательно к заполнению')
    browser.setValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]', 'Заголовок к полю')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error')
      .should.be.equal('Поле с таким именем уже есть, придумайте другое')
    browser.setValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]', 'Другой заголовок')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"] ~ .form__error')
      .should.be.equal('Поле обязательно к заполнению')
    browser.setValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]', 'alias-to-field')
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"] ~ .form__error').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.isExisting('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"] ~ .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"] ~ .form__error')
      .should.be.equal('Поле с таким веб-именем уже есть, придумайте другое')
  })
})
