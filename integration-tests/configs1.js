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
    browser.isSelected('[data-role="row-module-fields"]:nth-child(1) [data-role="field-required"]').should.be.false
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

  it ('updates section with string type', function () {
    browser.url('http://localhost:3000/cms/configs/string-section/')
    browser.getTitle().should.be.equal('Редактировать раздел «Раздел строки»')
    browser.isEnabled('[data-role="configs-add-alias"]').should.be.equal.false
    browser.isEnabled('[data-role="configs-add-title"]').should.be.equal.true

    browser.setValue('[data-role="configs-add-title"]', 'Раздел для строки')
    browser.elements('[data-role="row-module-fields"]').value.length.should.be.equal(1)
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]', 'Поле строки')
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]', 'string-field')

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.getText('[data-role="sections-menu"] .menu__item:nth-child(1) .menu__link').should.be.equal('Раздел для строки')

    browser.refresh()

    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]').should.be.equal('Поле строки')
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]').should.be.equal('string-field')
  })

  it ('adds couple more item', function () {
    browser.url('http://localhost:3000/cms/configs/string-section/')

    browser.click('[data-role="btn-add-field"]')
    browser.elements('[data-role="row-module-fields"]').value.length.should.be.equal(2)

    browser.setValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]', 'Поле текста')
    browser.setValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]', 'text-field')
    browser.selectByValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-type"]', 'text')

    browser.click('[data-role="btn-add-field"]')
    browser.elements('[data-role="row-module-fields"]').value.length.should.be.equal(3)

    browser.setValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-title"]', 'Поле даты')
    browser.setValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-alias"]', 'date-field')
    browser.selectByValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-type"]', 'date')

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.refresh()
    browser.elements('[data-role="row-module-fields"]').value.length.should.be.equal(3)
  })

  it ('drags item', function () {
    browser.url('http://localhost:3000/cms/configs/string-section/')
    browser.dragAndDrop(
      '[data-role="row-module-fields"]:nth-child(2) [data-role="btn-move-row"]',
      '[data-role="configs-add-alias"]'
    )
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]').should.be.equal('Поле текста')
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]').should.be.equal('text-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]').should.be.equal('Поле строки')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]').should.be.equal('string-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-title"]').should.be.equal('Поле даты')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-alias"]').should.be.equal('date-field')

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.refresh()

    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]').should.be.equal('Поле текста')
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]').should.be.equal('text-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]').should.be.equal('Поле строки')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]').should.be.equal('string-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-title"]').should.be.equal('Поле даты')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-alias"]').should.be.equal('date-field')

    browser.dragAndDrop(
      '[data-role="row-module-fields"]:nth-child(2) [data-role="btn-move-row"]',
      '.form__submit'
    )
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]').should.be.equal('Поле текста')
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]').should.be.equal('text-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]').should.be.equal('Поле даты')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]').should.be.equal('date-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-title"]').should.be.equal('Поле строки')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-alias"]').should.be.equal('string-field')

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)
    browser.refresh()

    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]').should.be.equal('Поле текста')
    browser.getValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]').should.be.equal('text-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-title"]').should.be.equal('Поле даты')
    browser.getValue('[data-role="row-module-fields"]:nth-child(2) [data-role="field-alias"]').should.be.equal('date-field')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-title"]').should.be.equal('Поле строки')
    browser.getValue('[data-role="row-module-fields"]:nth-child(3) [data-role="field-alias"]').should.be.equal('string-field')
  })
})
