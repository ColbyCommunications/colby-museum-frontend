<template>
    <div class="grid pdf-embed" aria-label="PDF Viewer">
        <PDFViewer
            :config="{
                src: `${blockData.pdf_url}`,
                theme: { preference: 'dark' },
                disabledCategories: ['annotation', 'document', 'redaction', 'panel', 'page'],
                zoom: {
                    defaultZoomLevel: ZoomMode.FitPage,
                },
                spread: {
                    defaultSpreadMode: spread
                }
            }"
            :style="{ width: '100%', height: '700px' }"
            />
    </div>
</template>

<script setup>
    import { PDFViewer, ZoomMode, SpreadMode } from '@embedpdf/vue-pdf-viewer';

    const props = defineProps({
        blockData: {
            type: Object,
            required: false,
        },
    });
    let spread = SpreadMode.None;
    if (props.blockData.page_spread === 'two') {
        spread = SpreadMode.Odd;
    }

</script>

<style>
.pdf-embed > div {
    grid-column: span 12 / span 12;
}   
</style>