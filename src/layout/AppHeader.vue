<template>
  <div>
    <div class="wrapper">
        <!-- Sidebar  -->
        <nav id="sidebar">
            <div id="dismiss" @click="dismiss">
                <i class="fas fa-arrow-left"></i>
            </div>

            <div class="sidebar-header">
              <img src="../assets/logo.png" height="60" width="60" alt="logo"/>
                <h3>Smarketlist</h3>
            </div>

            <ul class="list-unstyled components">
                <p>Login to be able to see your lists from multiple devices</p>

                <li v-if="!$store.getters.isLoggedIn">
                    <a href="#" @click="modal.visible = true">Login</a>
                </li>
                <li class="active" v-if="false">
                    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Home</a>
                    <ul class="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="#">Home 1</a>
                        </li>
                        <li>
                            <a href="#">Home 2</a>
                        </li>
                        <li>
                            <a href="#">Home 3</a>
                        </li>
                    </ul>
                </li>
                <li v-if="false">
                    <a href="#">Settings</a>
                </li>
            </ul>

            <ul class="list-unstyled CTAs" v-if="$store.getters.isLoggedIn">
                <li>
                    <a href="#" @click="logout()" class="article">Logout</a>
                </li>
            </ul>
        </nav>

        <!-- Page Content  -->
        <div id="content" >

            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="container">
                  <div>

                    <button type="button" id="sidebarCollapse" @click="sidebarCollapse" class="btn btn-default btn-transparent">
                        <i class="fas fa-bars"></i>
                    </button>

                  </div>
                </div>
            </nav>
        </div>
    </div>

    <div class="overlay" @click="dismiss"></div>

    <modal :show.sync="modal.visible"
          body-classes="login-modal bg-white"
          modal-classes="modal-dialog-centered modal-sm">
      <card type="secondary" shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 bg-white">
          <template v-if="modal.login">
              <img src="../assets/logo.png" height="60" width="60" alt="logo"/>
              <div class="text-center text-muted mb-4">
                  <small>Sign in with</small>
              </div>
              <form @submit.prevent="login()" role="form">
                  <base-input alternative
                              v-model="email"
                              class="mb-3 modal-input"
                              placeholder="Email"
                              addon-left-icon="ni ni-email-83">
                  </base-input>
                  <base-input alternative
                              v-model="password"
                              type="password"
                              class="modal-input"
                              placeholder="Password"
                              addon-left-icon="ni ni-lock-circle-open">
                  </base-input>
                  <div class="text-center">
                      <base-button v-if="!loading" type="orange" nativeType="submit" class="my-4 btn-orange">Sign In</base-button>
                      <button v-else class="btn my-4 btn-orange" type="button" disabled>
                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        Loading...
                      </button>
                  </div>
                  <div v-if="errorMsg" class="text-center red">
                    {{ errorMsg }}
                  </div>
              </form>
              <button class="btn btn-link btn-link-orange" v-if="!loading" @click="changeView()">Or create your account now</button>
          </template>
          <template v-else>
              <img src="../assets/logo.png" height="60" width="60" alt="logo"/>
              <div class="text-center text-muted mb-4">
                  <small>Sign up</small>
              </div>
              <form @submit.prevent="register()" role="form">
                  <base-input alternative
                              type="text"
                              class="modal-input"
                              v-model="name"
                              placeholder="Name"
                              addon-left-icon="ni ni-lock-circle-open">
                  </base-input>
                  <base-input alternative
                              v-model="email"
                              class="mb-3 modal-input"
                              placeholder="Email"
                              addon-left-icon="ni ni-email-83">
                  </base-input>
                  <base-input alternative
                              v-model="password"
                              type="password"
                              class="modal-input"
                              placeholder="Password"
                              addon-left-icon="ni ni-lock-circle-open">
                  </base-input>
                  <div class="text-center">
                      <base-button v-if="!loading" type="orange" nativeType="submit" class="my-4">Create account</base-button>
                      <button v-else class="btn my-4 btn-orange" type="button" disabled>
                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        Loading...
                      </button>
                  </div>
                  <div v-if="errorMsg" class="text-center red">
                    {{ errorMsg }}
                  </div>
              </form>
              <button class="btn btn-link btn-link-orange" v-if="!loading" @click="changeView()">Back to login</button>
          </template>
      </card>
  </modal>
  </div>
</template>
<script>
import Modal from '../components/Modal'
import JQuery from 'jquery'
let $ = JQuery

export default {
  components: {
    Modal,
  },
  data() {
    return {
      modal: {
        visible: false,
        login: true
      },
      name: '',
      email: '',
      password: '',
      loading: false
    }
  },
  computed: {
    errorMsg: {
      get() {
        return this.$store.state.auth.error
      },
      set(value) {
        this.$store.state.auth.error = value
      }
    }
  },
  methods: {
    changeView() {
      this.modal.login = !this.modal.login
      this.errorMsg = ''
      this.clearFields();
    },
    logout() {
      this.$store.commit('logout');
      this.dismiss();
    },
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
      this.loading = true;
      this.errorMsg = ''
    },
    register() {
      this.$store.dispatch("register", {
        name: this.name,
        email: this.email,
        password: this.password
      });
      this.loading = true;
      this.errorMsg = ''
    },
    clearFields() {
      this.name = '';
      this.email = '';
      this.password = '';
    },
    sidebarCollapse() {
      $('#sidebar').addClass('active');
      $('.overlay').addClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    },
    dismiss() {
      $('#sidebar').removeClass('active');
      $('.overlay').removeClass('active');
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if(mutation.type === 'login_success') {
        this.loading = false;

        this.modal.visible = false;
        this.dismiss();
      }
      if (mutation.type === 'login_error') {
        this.loading = false
      }
    })
    this.errorMsg = ''
  },
}
</script>
<style lang="scss">
#content {
  /*position: absolute;*/
}
.text-muted small{
  color: #FFF !important;
}

</style>
