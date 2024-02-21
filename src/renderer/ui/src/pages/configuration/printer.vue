<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { between, required } from '@vuelidate/validators'
import { isNil } from 'lodash'

import { usePrinterStore } from '@ui/stores/printerStore'

import useTranslations from '@ui/composables/useTranslations'
import useFeedback from '@ui/composables/useFeedback'

const printerStore = usePrinterStore()
const { usbPrinters, serialPrinters, selectedPrinter, printingConfiguration } = storeToRefs(printerStore)

const inputLimits = {
    paperWidth: {
        minValue: 10,
        maxValue: 200
    },
    paperMargin: {
        minValue: 1,
        maxValue: 20
    }
}

const localSelectedPrinterId = ref<string | null>(null)

const localPrinterConfiguration = reactive<{
  automatic: boolean | null;
  paperWidth: number | null;
  paperMargin: number | null;
}>({
    automatic: null,
    paperWidth: null,
    paperMargin: null
})

const serialPrintersAsOptions = computed(() =>
    serialPrinters.value
        .map(port => port.getInfo())
        .map(({productId, usbProductId, product,serialNumber,locationId, ...otherProps}) => ({
            key: Object.values({productId, usbProductId, product,serialNumber,locationId}).find(value => !isNil(value)),
            label: Object.entries({productId, usbProductId, product,serialNumber,locationId, ...otherProps})
                .filter(([,value]) => !isNil(value))
                .reduce((label, [key, value]) => `${label}:${key}:${value}` , '')
        }))
)

const usbPrintersAsOptions = computed(() =>
    usbPrinters.value.map(({ productId, productName }) => ({
        key: productId,
        label: productName?.replaceAll('\u0000', '')
    }))
)

const printersAsOptions = computed(() =>
    [...usbPrintersAsOptions.value, ...serialPrintersAsOptions.value]
)

const computedSelectedPrinterId = computed({
    get() {
        return localSelectedPrinterId.value ?? selectedPrinter.value?.productId
    },
    set(newPrinterId) {
        console.log({ newPrinterId })
        localSelectedPrinterId.value = `${newPrinterId}`
    }
})

const computedPaperWidth = computed<number>({
    get() {
        return (
            localPrinterConfiguration.paperWidth ??
      printingConfiguration.value?.paperWidth ??
      inputLimits.paperWidth.minValue
        )
    },
    set(newPaperWidth) {
        localPrinterConfiguration.paperWidth = newPaperWidth
    }
})

const computedPaperMargin = computed<number>({
    get() {
        return (
            localPrinterConfiguration.paperMargin ??
      printingConfiguration.value?.paperMargin ??
      inputLimits.paperMargin.minValue
        )
    },
    set(newPaperMargin) {
        localPrinterConfiguration.paperMargin = newPaperMargin
    }
})

const computedAutomaticPrinting = computed<boolean>({
    get() {
        return localPrinterConfiguration.automatic ?? printingConfiguration.value?.automatic ?? true
    },
    set(isAutomatic) {
        localPrinterConfiguration.automatic = isAutomatic
    }
})

const localState = computed(() => ({
    selectedPrinter: computedSelectedPrinterId.value,
    paperWidth: computedPaperWidth.value,
    paperMargin: computedPaperMargin.value,
    automaticPrinting: computedAutomaticPrinting.value
}))

const hasConfigurationBeenUpdated = computed(
    () =>
        !Object.entries(localState.value).every(([localKey, localValue]) => {
            const savedConfiguration = {
                selectedPrinterId: selectedPrinter.value,
                ...printingConfiguration.value
            }

            return `${savedConfiguration[localKey]}` === `${localValue}`
        })
)

const { translate, createTranslatedValidator } = useTranslations('pages.printerConfiguration')

const vuelidate = useVuelidate(
    {
        selectedPrinter: {
            required: createTranslatedValidator(required)
        },
        paperWidth: {
            required: createTranslatedValidator(required),
            between: createTranslatedValidator(
                between(inputLimits.paperWidth.minValue, inputLimits.paperWidth.maxValue)
            )
        },
        paperMargin: {
            required: createTranslatedValidator(required),
            between: createTranslatedValidator(
                between(inputLimits.paperMargin.minValue, inputLimits.paperMargin.maxValue)
            )
        },
        automaticPrinting: {
            required: createTranslatedValidator(required)
        }
    },
    localState
)

const errorMessages = computed(() =>
    vuelidate.value.$errors.reduce(
        (messages: Record<string, string[]>, { $propertyPath, $message }) => ({
            ...messages,
            [$propertyPath]: [...(messages[$propertyPath] || []), $message.toString()]
        }),
        {}
    )
)

const {
    loadSelectedPrinterId,
    loadAllPrinters,
    loadPrintingConfiguration,
    updateSelectedPrinterId,
    updatePrintingConfiguration,
    testPrintingConfiguration
} = printerStore

async function handleSavePrintingConfiguration() {
    const isValid = await vuelidate.value.$validate()

    if (isValid) {
        await Promise.all([
            updateSelectedPrinterId(computedSelectedPrinterId.value || null),
            updatePrintingConfiguration({
                automatic: computedAutomaticPrinting.value,
                paperWidth: computedPaperWidth.value,
                paperMargin: computedPaperMargin.value
            })
        ])

        useFeedback({
            success: true,
            message: 'success.venue.save-venue-printer-configuration'
        })
    }
}

async function handleDeletePrinter() {
    await updateSelectedPrinterId(null)

    useFeedback({
        success: true,
        message: 'success.venue.delete-venue-printer'
    })
}

async function handleTest(): Promise<void> {
    await testPrintingConfiguration()
}

function goBack(): void {
}

onMounted(async () => {
    await Promise.all([loadAllPrinters(), loadSelectedPrinterId(), loadPrintingConfiguration()])

    console.log({ printers: usbPrinters.value, serialInfo: serialPrinters.value.map(port => JSON.stringify(port.getInfo())), serial: serialPrinters.value })

    if (printingConfiguration.value) {
        const { automatic, paperMargin, paperWidth } = printingConfiguration.value

        localPrinterConfiguration.automatic = automatic || null
        localPrinterConfiguration.paperMargin = paperMargin || null
        localPrinterConfiguration.paperWidth = paperWidth || null
    }
})
</script>

<template>
  <v-container fluid>
    <d-vertical-spacer x-small />

    <v-row align="center">
      <v-col cols="auto">
        <v-btn exact small icon @click="goBack">
          <d-icon name="mdi-chevron-left" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <h1>
          <span>{{ translate('title') }}</span>
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="top-pa-0">
        <v-divider />
      </v-col>
    </v-row>

    <d-vertical-spacer medium />

    <v-row justify="center">
      <v-col class="top-pa-0">
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col>
              <v-col class="input-field-title">
                <p>
                  {{ translate('printerName') }}
                </p>
              </v-col>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col class="top-pa-0">
              <v-select
                v-model="computedSelectedPrinterId"
                :label="translate('printerName')"
                :items="printersAsOptions"
                hide-details="auto"
                :error="vuelidate.selectedPrinter.$error"
                :error-messages="errorMessages.selectedPrinter"
                item-title="label"
                item-value="key"
                no-data-text="No printers to be found"
                rounded
                dense
                variant="solo"
              >
                <template #selection="{index}">
                  {{ printersAsOptions[index].label }}
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-col cols="6">
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col>
              <v-col class="input-field-title">
                <p>
                  {{ translate('paperWidth') }}
                </p>
              </v-col>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col class="top-pa-0">
              <v-text-field
                v-model="computedPaperWidth"
                type="number"
                variant="solo"
                rounded
                dense
                :label="translate('paperWidth')"
                hide-details="auto"
                :min="inputLimits.paperWidth.minValue"
                :max="inputLimits.paperWidth.maxValue"
                :error="vuelidate.paperWidth.$error"
                :error-messages="errorMessages.paperWidth"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col cols="6">
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col class="input-field-title">
              <p>
                {{ translate('margin') }}
              </p>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col class="top-pa-0">
              <v-text-field
                v-model="computedPaperMargin"
                type="number"
                variant="solo"
                rounded
                dense
                :label="translate('margin')"
                hide-details="auto"
                :min="inputLimits.paperMargin.minValue"
                :max="inputLimits.paperMargin.maxValue"
                :error="vuelidate.paperMargin.$error"
                :error-messages="errorMessages.paperMargin"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col class="top-pa-0">
        <v-switch
          v-model="computedAutomaticPrinting"
          :label="translate('automatic')"
          hide-details="auto"
          :error="vuelidate.automaticPrinting.$error"
          :error-messages="errorMessages.automaticPrinting"
        />
      </v-col>
    </v-row>

    <d-vertical-spacer small />

    <v-row justify="center" dense>
      <v-col cols="5">
        <v-btn
          :disabled="!hasConfigurationBeenUpdated"
          color="secondary"
          rounded
          block
          @click="handleSavePrintingConfiguration"
        >
          {{ translate('actions.save') }}
        </v-btn>
      </v-col>

      <v-col v-if="selectedPrinter" cols="5">
        <v-btn
          :disabled="!selectedPrinter"
          color="error"
          rounded
          block
          @click="handleDeletePrinter"
        >
          {{ translate('actions.delete') }}
        </v-btn>
      </v-col>

      <v-col cols="5">
        <v-btn
          color="info"
          rounded
          block
          @click="handleTest"
        >
          {{ translate('actions.test') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
