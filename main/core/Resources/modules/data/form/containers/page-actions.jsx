import React from 'react'

const FormPageAction = props =>
  <div>
    form page actions
  </div>

FormPageAction.propTypes = {
  formName: T.string.isRequired,
  icon: T.string
}

const test = props =>
  <div>
    <FormPageAction
      formName="groups.current"
      create={(formData) => ['apiv2_group_create']}
      update={(formData) => ['apiv2_group_update', {id: formData.id}]}
      cancel="#/groups"
    />
  </div>

export {
  FormPageAction
}
