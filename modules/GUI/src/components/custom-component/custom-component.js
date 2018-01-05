import Component from 'libs/component'
import {fetch} from 'libs/helpers'

export default class CustomComponent extends Component
{
  static get selector() {
    return 'custom-component'
  }

  get events() {
    return {
      'click: [data-role="button"]': this.buttonClick
    }
  }

  constructor(node) {
    super(node)

    console.log('init component')
    console.log(node)
  }

  buttonClick(e) {
    console.log('button clicked !')
    console.log(e.target)
  }
}
