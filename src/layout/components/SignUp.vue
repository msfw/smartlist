<template>
  <div>
    <img src="../../assets/logo.png" height="60" width="60" alt="logo"/>
    <div class="text-center text-muted mb-4" v-if="false">
        <small>Sign up</small>
    </div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(register)" role="form" style="margin-top: 20px">

        <ValidationProvider :name="$t('labels.name')" rules="required" v-slot="{ errors }">
          <base-input alternative
                      type="text"
                      class="modal-input"
                      v-model="lname"
                      :placeholder="$t('labels.name')"
                      addon-left-icon="ni ni-single-02"
                      :error="errors[0]">
          </base-input>
        </ValidationProvider>

        <ValidationProvider :name="$t('labels.email')" rules="required|email" v-slot="{ errors }">
          <base-input alternative
                      v-model="lemail"
                      class="mb-3 modal-input"
                      :placeholder="$t('labels.email')"
                      addon-left-icon="ni ni-email-83"
                      :error="errors[0]">
          </base-input>
        </ValidationProvider>

        <ValidationProvider :name="$t('labels.password')" rules="required" v-slot="{ errors }">
          <base-input alternative
                      v-model="lpassword"
                      type="password"
                      class="modal-input"
                      :placeholder="$t('labels.password')"
                      addon-left-icon="ni ni-lock-circle-open"
                      :error="errors[0]">
          </base-input>
        </ValidationProvider>

        <div class="text-center my-2">
            <base-button v-if="!loading" type="orange" nativeType="submit" class="">{{ $t('buttons.createAccount') }}</base-button>
            <button v-else class="btn btn-orange" type="button" disabled>
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              {{ $t('buttons.loading') }}
            </button>
        </div>
        <div v-if="errorMsg" class="text-center red">
          {{ errorMsg }}
        </div>
      </form>

    </ValidationObserver>

    <button class="btn btn-link btn-link-orange" v-if="!loading" @click="$emit('close')">{{ $t('buttons.backToLogin') }}</button>
  </div>
</template>
<script>
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('email', email);
extend('required', required);
export default {
  data() {
    return {
      lname: '',
      lemail: '',
      lpassword: ''
    }
  },
  props: {
    errorMsg: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    register() {
      this.$emit('register', {
        name: this.lname,
        email: this.lemail,
        password: this.lpassword
      })
    }
  },
}
</script>
