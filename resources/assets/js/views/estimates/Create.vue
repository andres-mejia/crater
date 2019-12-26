<template>
  <div class="estimate-create-page main-content">
    <form v-if="!initLoading" action @submit.prevent="submitEstimateData">
      <div class="page-header">
        <h3
          v-if="$route.name === 'estimates.edit'"
          class="page-title"
        >{{ $t('estimates.edit_estimate') }}</h3>
        <h3 v-else class="page-title">{{ $t('estimates.new_estimate') }}</h3>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link slot="item-title" to="/admin/dashboard">{{ $t('general.home') }}</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link slot="item-title" to="/admin/estimates">{{ $tc('estimates.estimate', 2) }}</router-link>
          </li>
          <li
            v-if="$route.name === 'estimates.edit'"
            class="breadcrumb-item"
          >{{ $t('estimates.edit_estimate') }}</li>
          <li v-else class="breadcrumb-item">{{ $t('estimates.new_estimate') }}</li>
        </ol>
        <div class="page-actions row">
          <a
            v-if="$route.name === 'estimates.edit'"
            :href="`/estimates/pdf/${newEstimate.unique_hash}`"
            target="_blank"
            class="mr-3 base-button btn btn-outline-primary default-size invoice-action-btn"
            outline
            color="theme"
          >{{ $t('general.view_pdf') }}</a>
          <base-button
            :loading="isLoading"
            :disabled="isLoading"
            icon="save"
            class="invoice-action-btn"
            color="theme"
            type="submit"
          >{{ $t('estimates.save_estimate') }}</base-button>
        </div>
      </div>
      <div class="row estimate-input-group">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <div class="form-group">
                <label class="control-label">{{ $t('estimates.name') }}</label>
                <span class="text-danger">*</span>
                <base-input
                  v-model.trim="newEstimate.name"
                  :invalid="$v.newEstimate.name.$error"
                  focus
                  type="text"
                  name="name"
                  @input="$v.newEstimate.name.$touch()"
                />
                <div v-if="$v.newEstimate.name.$error">
                  <span
                    v-if="!$v.newEstimate.name.required"
                    class="text-danger"
                  >{{ $t('validation.required') }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('estimates.quantity') }}</label>
                <span class="text-danger">*</span>
                <div class="base-input">
                  <money
                    :class="{'invalid' : $v.newEstimate.quantity.$error}"
                    v-model="newEstimate.quantity"
                    v-bind="defaultCurrency"
                    class="input-field"
                  />
                </div>
                <div v-if="$v.newEstimate.quantity.$error">
                  <span
                    v-if="!$v.newEstimate.quantity.required"
                    class="text-danger"
                  >{{ $t('validation.required') }}</span>
                  <span
                    v-if="!$v.newEstimate.quantity.maxLength"
                    class="text-danger"
                  >{{ $t('validation.quantity_maxlength') }}</span>
                  <span
                    v-if="!$v.newEstimate.quantity.minValue"
                    class="text-danger"
                  >{{ $t('validation.quantity_minvalue') }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('estimates.type') }}</label>
                <base-select
                  v-model="newEstimate.type"
                  :options="estimateTypes"
                  :searchable="true"
                  :show-labels="false"
                  :placeholder="$t('estimates.select_a_type')"
                  label="name"
                />
              </div>
              <div class="form-group">
                <label for="description">{{ $t('estimates.notes') }}</label>
                <base-text-area
                  v-model="newEstimate.description"
                  rows="2"
                  name="description"
                  @input="$v.newEstimate.description.$touch()"
                />
              </div>
              <div class="form-group">
                <base-button
                  :loading="isLoading"
                  :disabled="isLoading"
                  icon="save"
                  color="theme"
                  type="submit"
                  class="collapse-button"
                >{{ isEdit ? $t('estimates.update_Estimate') : $t('estimates.save_estimate') }}</base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import MultiSelect from "vue-multiselect";
import EstimateItem from "./Item";
import EstimateStub from "../../stub/estimate";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { validationMixin } from "vuelidate";
import Guid from "guid";
import TaxStub from "../../stub/tax";
import Tax from "./EstimateTax";
const {
  required,
  between,
  numeric,
  minValue,
  minLength,
  maxLength
} = require("vuelidate/lib/validators");

export default {
  components: {
    EstimateItem,
    MultiSelect,
    Tax,
    draggable
  },
  mixins: [validationMixin],
  data() {
    return {
      estimateTypes: [
        { name: "Recurrente", value: "rec" },
        { name: "Estratégico", value: "est" }
      ],
      newEstimate: {
        name: "",
        title: "",
        period: "",
        status: "",
        type: "",
        description: "",
        quantity: 0,

        estimate_date: null,
        expiry_date: null,
        estimate_number: null,
        user_id: null,
        estimate_template_id: 1,
        sub_total: null,
        total: null,
        tax: null,
        notes: null,
        discount_type: "fixed",
        discount_val: 0,
        reference_number: null,
        discount: 0,
        items: [
          {
            ...EstimateStub,
            id: Guid.raw(),
            taxes: [{ ...TaxStub, id: Guid.raw() }]
          }
        ],
        taxes: []
      },
      customers: [],
      itemList: [],
      estimateTemplates: [],
      selectedCurrency: "",
      taxPerItem: null,
      discountPerItem: null,
      initLoading: false,
      isLoading: false,
      maxDiscount: 0
    };
  },
  validations() {
    return {
      newEstimate: {
        name: {
          required
        },
        title: {
          required
        },
        period: {
          required
        },
        quantity: {
          required,
          numeric,
          maxLength: maxLength(20),
          minValue: minValue(0.1)
        },
        estimate_date: {
          required
        },
        expiry_date: {
          required
        },
        estimate_number: {
          required
        },
        discount_val: {
          between: between(0, this.subtotal)
        },
        notes: {
          maxLength: maxLength(255)
        },
        reference_number: {
          maxLength: maxLength(255)
        }
      },
      selectedCustomer: {
        required
      }
    };
  },
  computed: {
    ...mapGetters("general", ["itemDiscount"]),
    ...mapGetters("currency", ["defaultCurrency"]),
    ...mapGetters("estimate", ["getTemplateId", "selectedCustomer"]),
    currency() {
      return this.selectedCurrency;
    },
    subtotalWithDiscount() {
      return this.subtotal - this.newEstimate.discount_val;
    },
    total() {
      return this.subtotalWithDiscount + this.totalTax;
    },
    subtotal() {
      return this.newEstimate.items.reduce(function(a, b) {
        return a + b["total"];
      }, 0);
    },
    discount: {
      get: function() {
        return this.newEstimate.discount;
      },
      set: function(newValue) {
        if (this.newEstimate.discount_type === "percentage") {
          this.newEstimate.discount_val = (this.subtotal * newValue) / 100;
        } else {
          this.newEstimate.discount_val = newValue * 100;
        }

        this.newEstimate.discount = newValue;
      }
    },
    totalSimpleTax() {
      return window._.sumBy(this.newEstimate.taxes, function(tax) {
        if (!tax.compound_tax) {
          return tax.amount;
        }

        return 0;
      });
    },

    totalCompoundTax() {
      return window._.sumBy(this.newEstimate.taxes, function(tax) {
        if (tax.compound_tax) {
          return tax.amount;
        }

        return 0;
      });
    },
    totalTax() {
      if (this.taxPerItem === "NO" || this.taxPerItem === null) {
        return this.totalSimpleTax + this.totalCompoundTax;
      }

      return window._.sumBy(this.newEstimate.items, function(tax) {
        return tax.tax;
      });
    },
    allTaxes() {
      let taxes = [];

      this.newEstimate.items.forEach(item => {
        item.taxes.forEach(tax => {
          let found = taxes.find(_tax => {
            return _tax.tax_type_id === tax.tax_type_id;
          });

          if (found) {
            found.amount += tax.amount;
          } else if (tax.tax_type_id) {
            taxes.push({
              tax_type_id: tax.tax_type_id,
              amount: tax.amount,
              percent: tax.percent,
              name: tax.name
            });
          }
        });
      });

      return taxes;
    },
    isEdit() {
      if (this.$route.name === "estimates.edit") {
        return true;
      }
      return false;
    }
  },
  watch: {
    selectedCustomer(newVal) {
      if (newVal && newVal.currency) {
        this.selectedCurrency = newVal.currency;
      } else {
        this.selectedCurrency = this.defaultCurrency;
      }
    },
    subtotal(newValue) {
      if (this.newEstimate.discount_type === "percentage") {
        this.newEstimate.discount_val =
          (this.newEstimate.discount * newValue) / 100;
      }
    }
  },
  created() {
    this.loadData();
    this.fetchInitialItems();
    this.resetSelectedCustomer();
    window.hub.$on("newTax", this.onSelectTax);
  },
  methods: {
    ...mapActions("modal", ["openModal"]),
    ...mapActions("estimate", [
      "addEstimate",
      "fetchCreateEstimate",
      "fetchEstimate",
      "resetSelectedCustomer",
      "selectCustomer",
      "updateEstimate"
    ]),
    ...mapActions("item", ["fetchItems"]),
    selectFixed() {
      if (this.newEstimate.discount_type === "fixed") {
        return;
      }

      this.newEstimate.discount_val = this.newEstimate.discount * 100;
      this.newEstimate.discount_type = "fixed";
    },
    selectPercentage() {
      if (this.newEstimate.discount_type === "percentage") {
        return;
      }

      this.newEstimate.discount_val =
        (this.subtotal * this.newEstimate.discount) / 100;

      this.newEstimate.discount_type = "percentage";
    },
    updateTax(data) {
      Object.assign(this.newEstimate.taxes[data.index], { ...data.item });
    },
    async fetchInitialItems() {
      await this.fetchItems({
        filter: {},
        orderByField: "",
        orderBy: ""
      });
    },
    async loadData() {
      if (this.$route.name === "estimates.edit") {
        this.initLoading = true;
        let response = await this.fetchEstimate(this.$route.params.id);

        if (response.data) {
          this.selectCustomer(response.data.estimate.user_id);
          this.newEstimate = response.data.estimate;
          this.newEstimate.estimate_date = moment(
            response.data.estimate.estimate_date,
            "YYYY-MM-DD"
          ).toString();
          this.newEstimate.expiry_date = moment(
            response.data.estimate.expiry_date,
            "YYYY-MM-DD"
          ).toString();
          this.discountPerItem = response.data.discount_per_item;
          this.taxPerItem = response.data.tax_per_item;
          this.selectedCurrency = this.defaultCurrency;
          this.estimateTemplates = response.data.estimateTemplates;
        }
        this.initLoading = false;
        return;
      }

      this.initLoading = true;
      let response = await this.fetchCreateEstimate();
      if (response.data) {
        this.discountPerItem = response.data.discount_per_item;
        this.taxPerItem = response.data.tax_per_item;
        this.selectedCurrency = this.defaultCurrency;
        this.estimateTemplates = response.data.estimateTemplates;
        let today = new Date();
        this.newEstimate.estimate_date = moment(today).toString();
        this.newEstimate.expiry_date = moment(today)
          .add(7, "days")
          .toString();
        this.newEstimate.estimate_number = response.data.nextEstimateNumber;
        this.itemList = response.data.items;
      }
      this.initLoading = false;
    },
    removeCustomer() {
      this.resetSelectedCustomer();
    },
    openTemplateModal() {
      this.openModal({
        title: this.$t("general.choose_template"),
        componentName: "EstimateTemplate",
        data: this.estimateTemplates
      });
    },
    addItem() {
      this.newEstimate.items.push({
        ...EstimateStub,
        id: Guid.raw(),
        taxes: [{ ...TaxStub, id: Guid.raw() }]
      });
    },
    removeItem(index) {
      this.newEstimate.items.splice(index, 1);
    },
    updateItem(data) {
      Object.assign(this.newEstimate.items[data.index], { ...data.item });
    },
    submitEstimateData() {
      if (!this.checkValid()) {
        return false;
      }

      this.isLoading = true;

      let data = {
        ...this.newEstimate,
        estimate_date: moment(this.newEstimate.estimate_date).format(
          "DD/MM/YYYY"
        ),
        expiry_date: moment(this.newEstimate.expiry_date).format("DD/MM/YYYY"),
        sub_total: this.subtotal,
        total: this.total,
        tax: this.totalTax,
        user_id: null,
        estimate_template_id: this.getTemplateId
      };

      if (this.selectedCustomer != null) {
        data.user_id = this.selectedCustomer.id;
      }

      if (this.$route.name === "estimates.edit") {
        this.submitUpdate(data);
        return;
      }

      this.submitSave(data);
    },
    submitSave(data) {
      this.addEstimate(data)
        .then(res => {
          if (res.data) {
            window.toastr["success"](this.$t("estimates.created_message"));
            this.$router.push("/admin/estimates");
          }

          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
        });
    },
    submitUpdate(data) {
      this.updateEstimate(data)
        .then(res => {
          if (res.data) {
            window.toastr["success"](this.$t("estimates.updated_message"));
            this.$router.push("/admin/estimates");
          }

          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
        });
    },
    checkItemsData(index, isValid) {
      this.newEstimate.items[index].valid = isValid;
    },
    onSelectTax(selectedTax) {
      let amount = 0;

      if (selectedTax.compound_tax && this.subtotalWithDiscount) {
        amount =
          ((this.subtotalWithDiscount + this.totalSimpleTax) *
            selectedTax.percent) /
          100;
      } else if (this.subtotalWithDiscount && selectedTax.percent) {
        amount = (this.subtotalWithDiscount * selectedTax.percent) / 100;
      }

      this.newEstimate.taxes.push({
        ...TaxStub,
        id: Guid.raw(),
        name: selectedTax.name,
        percent: selectedTax.percent,
        compound_tax: selectedTax.compound_tax,
        tax_type_id: selectedTax.id,
        amount
      });

      this.$refs.taxModal.close();
    },
    removeEstimateTax(index) {
      this.newEstimate.taxes.splice(index, 1);
    },
    checkValid() {
      this.$v.newEstimate.$touch();
      this.$v.selectedCustomer.$touch();
      window.hub.$emit("checkItems");
      let isValid = true;
      this.newEstimate.items.forEach(item => {
        if (!item.valid) {
          isValid = false;
        }
      });
      if (
        !this.$v.selectedCustomer.$invalid &&
        this.$v.newEstimate.$invalid === false &&
        isValid === true
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>
