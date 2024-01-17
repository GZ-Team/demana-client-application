<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { usePrinterStore } from '../stores/printerStore';

import useTranslations from '../composables/useTranslations'

const printerStore = usePrinterStore();
const { loadAllPrinters, loadPrintingConfiguration } = printerStore;
const { usbPrinters, selectedPrinter, printingConfiguration } = storeToRefs(printerStore);

const localSelectedPrinterId = ref(null)

const localSettings = reactive({
    automatic: true,
    paperWidth: null,
    paperMargin: null
})

const printersAsOptions = computed(() =>
    //TODO: show serial printers too
    usbPrinters.value.map(({ productId, productName }) => ({
        key: productId,
        label: productName?.replace('\u0000', '')
    }))
);

const computedSelectedPrinterId = computed({
    get() {
        return localSelectedPrinterId.value || selectedPrinter.value?.productId
    },
    set(newPrinterId) {
        localSelectedPrinterId.value = newPrinterId
    }
});

const computedPaperWidth = computed({
    get() {
        return localSettings.paperWidth || printingConfiguration.value.paperWidth
    },
    set(newPaperWidth) {
        localSettings.paperWidth = newPaperWidth
    }
})

const computedPaperMargin = computed({
    get() {
        return localSettings.paperMargin | printingConfiguration.value.paperMargin
    },
    set(newPaperMargin) {
        localSettings.paperMargin = newPaperMargin
    }
})

const computedAutomaticPrinting = computed<boolean>({
    get() {
        return localSettings.automatic || printingConfiguration.value.automatic
    },
    set(isAutomatic) {
        localSettings.automatic = isAutomatic
    }
})

const { translate } = useTranslations('pages.printerConfiguration')

async function savePrinter() {
    window.api.setSelectedPrinter(selectedPrinter.value.productId);

    const feedback = {
        message: 'success.venue.save-venue-printer-configuration'
    };
}

async function deletePrinter() {
    window.api.setSelectedPrinter(null);

    const feedback = {
        message: 'success.venue.delete-venue-printer'
    };
}

async function testPrinter(): Promise<void> {
    window.api.sendMessage({ target: 'worker', content: 'test-printer' });
}

function goBack(): void {

}

onMounted(async () => {
    await Promise.all([
        loadAllPrinters(),
        loadPrintingConfiguration()
    ])
});
</script>

<template>
    <v-container fluid>
        <d-vertical-spacer x-small />

        <v-row>
            <v-col cols="auto" class="back-arrow">
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
                <v-select v-model="computedSelectedPrinterId" :label="translate('printerName')" :items="printersAsOptions"
                    item-text="label" item-value="key" no-data-text="No printers to be found" rounded solo />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12" class="input-field-title">
                        <d-vertical-spacer x-small />
                        <p>
                            {{ translate('paperWidth') }}
                        </p>
                    </v-col>
                    <v-col cols="12" class="top-pa-0">
                        <v-text-field v-model="computedPaperWidth" type="number" solo flat rounded dense
                            :label="translate('paperWidth')" />
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="6">
                <v-row>
                    <v-col cols="12" class="input-field-title">
                        <d-vertical-spacer x-small />
                        <p>
                            {{ translate('margin') }}
                        </p>
                    </v-col>
                    <v-col cols="12" class="top-pa-0">

                        <v-text-field v-model="computedPaperMargin" type="number" solo flat rounded dense
                            :label="translate('margin')" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col class="top-pa-0">
                <v-switch v-model="computedAutomaticPrinting" :label="translate('automatic')" />
            </v-col>
        </v-row>

        <d-vertical-spacer small />

        <v-row justify="center" dense>
            <v-col cols="5" :class="{ 'margin-bottom': !selectedPrinter }">
                <v-btn color="secondary" rounded block @click="savePrinter">
                    {{ translate('actions.save') }}
                </v-btn>
            </v-col>

            <v-col v-if="selectedPrinter" cols="5">
                <v-btn color="error" rounded block @click="deletePrinter">
                    {{ translate('actions.delete') }}
                </v-btn>
            </v-col>

            <v-col v-if="selectedPrinter" cols="5">
                <v-btn color="info" rounded block @click="testPrinter">
                    {{ translate('actions.test') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>../stores/printerStore