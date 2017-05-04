var chai = require('chai')

chai.should()

var TIMEOUT_FOR_SEND = 300

describe ('Configs type checkbox', function () {
  it ('adds section with checkbox', function () {
    browser.url('http://localhost:3333/cms/configs/add/')
    browser.setValue('#title', 'Раздел чекбоксов')
    browser.setValue('#alias', 'checkbox-section')
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-title"]', 'Поле для чекбокса')
    browser.setValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-alias"]', 'checkbox-field')
    browser.selectByValue('[data-role="row-module-fields"]:nth-child(1) [data-role="field-type"]', 'checkbox')
    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)

    browser.isExisting('[data-role="row-module-fields"]:nth-child(1) [data-role="btn-config-field"] + .form__error').should.be.true
    browser.getText('[data-role="row-module-fields"]:nth-child(1) [data-role="btn-config-field"] + .form__error').should.be.equal('Задайте настройки')

    browser.click('[data-role="row-module-fields"]:nth-child(1) [data-role="btn-config-field"]')
    browser.isVisible('[data-role="configs-popup"]').should.be.true
    browser.elements('[data-role="configs-checkbox-options-contain"] .form__row-option').value.length.should.be.equal(1)

    browser.isExisting('[data-role="configs-checkbox-options-contain"]:nth-child(1) + .form__error').should.be.true
    browser.setValue('[data-role="configs-form"] [data-role="configs-checkbox-num-options"]', '4')
    browser.keys('\uE007')

    browser.elements('[data-role="configs-checkbox-options-contain"] .form__row-option').value.length.should.be.equal(4)

    browser.setValue('[data-role="configs-checkbox-options-contain"] .form__row-option:nth-child(1) [data-role="configs-checkbox-option-label"]', 'item1')
    browser.setValue('[data-role="configs-checkbox-options-contain"] .form__row-option:nth-child(2) [data-role="configs-checkbox-option-label"]', 'item2')
    browser.setValue('[data-role="configs-checkbox-options-contain"] .form__row-option:nth-child(3) [data-role="configs-checkbox-option-label"]', 'item3')
    browser.setValue('[data-role="configs-checkbox-options-contain"] .form__row-option:nth-child(4) [data-role="configs-checkbox-option-label"]', 'item4')

    browser.isExisting('[data-role="configs-checkbox-options-contain"]:nth-child(1) + .form__error').should.be.false

    browser.click('[data-role="configs-form"] .form__btn--submit')
    browser.pause(150)
    browser.isVisible('[data-role="configs-popup"]').should.be.false

    browser.click('.form__btn--submit')
    browser.pause(TIMEOUT_FOR_SEND)

    browser.url('http://localhost:3333/cms/configs/checkbox-section/')
    browser.getValue('#title').should.be.equal('Раздел чекбоксов')
  })

  // it ('checks correct section', function () {
  //   browser.url('http://localhost:3333/cms/configs/checkbox-section/')
  //   browser.getValue('#title').should.be.equal('Раздел чекбоксов')
  //
  // })
})
