<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    validator(columns) {
      return columns.every((column) =>
        Object.keys(column).every((columnProp) => ['key', 'label'].includes(columnProp))
      )
    }
  },
  items: { type: Array, default: () => [] }
})
</script>

<template>
  <table class="d-table">
    <thead>
      <tr>
        <th v-for="{ key, label } in columns" :key="`table-header-${key}`">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, itemIndex) in items" :key="`table-rows-${itemIndex}`">
        <td v-for="{ key } in columns" :key="`table-rows-${itemIndex}-column-${key}`">
          <slot :name="`row:${key}`">
            {{ item[key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
.d-table {
  tr {
    border: black solid 0.1rem;
    text-align: left;
  }

  th {
    font-weight: bold;
    padding: 0.5rem 0.25rem;
  }

  td {
    padding: 0.25rem;
  }
}
</style>
