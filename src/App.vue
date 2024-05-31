<template>
  <div class="container">
    <div class="Data">
      <div class="Input">
    <h1>Management Data</h1>

    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>Judul</label>
          <input type="text" v-model="newItem.title" placeholder="Judul">
        </div>
        <div class="field">
          <label>Link Gambar</label>
          <input type="text" v-model="newItem.image" placeholder="Link Gambar">
        </div>
        <div class="field">
          <label>Deskripsi</label>
          <input type="text" v-model="newItem.description" placeholder="Deskripsi">
        </div>
      </div>
      <button class="ui primary button" @click="addItem">Simpan</button>
    </div>
  </div>

    <br>
  <div class="Kartu">
    <div class="ui cards">
      <div v-for="(item, index) in items" :key="index" class="card">
        <div class="content">
          <div class="header">{{ item.title }}</div>
          <div class="meta">{{ item.description }}</div>
          <div class="description">
            <img :src="item.image" style="max-width: 100%; max-height: 200px;">
          </div>
        </div>
        <div class="extra content">
          <div class="ui two buttons">
            <div class="ui basic green button" @click="editItem(index)">Edit</div>
            <div class="ui basic red button" @click="deleteItem(index)">Delete</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'app',
  data() {
    return {
      items: [],
      newItem: {
        title: '',
        image: '',
        description: ''
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/items')
        .then(response => {
          this.items = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    addItem() {
      axios.post('http://localhost:3000/items', this.newItem)
        .then(response => {
          this.items.push(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Data berhasil disimpan!',
            showConfirmButton: false,
            timer: 1500
          });
          this.clearForm();
        })
        .catch(error => {
          console.error('Error adding item:', error);
        });
    },
    editItem(index) {
      let item = this.items[index];
      Swal.fire({
        title: 'Edit Item',
        html:
          `<label style="display:flex;" for="swal-title">Judul</label>` +
          `<input style="display:flex;" id="swal-title" class="swal2-input" value="${item.title}">` +
          `<label style="display:flex;" for="swal-image">Link Img</label>` +
          `<input style="display:flex;"id="swal-image" class="swal2-input" value="${item.image}">` +
          `<label style="display:flex;"for="swal-description">Deskripsi</label>` +
          `<input style="display:flex;"id="swal-description" class="swal2-input" value="${item.description}">`,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
          return {
            title: document.getElementById('swal-title').value,
            image: document.getElementById('swal-image').value,
            description: document.getElementById('swal-description').value
          };
        }
      }).then(result => {
        if (result.isConfirmed) {
          let data = result.value;
          axios.patch(`http://localhost:3000/items/${item.id}`, data)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Data berhasil diubah!',
                showConfirmButton: false,
                timer: 1500
              });
              item.title = data.title;
              item.image = data.image;
              item.description = data.description;
            })
            .catch(error => {
              console.error('Error editing item:', error);
            });
        }
      });
    },
    deleteItem(index) {
      let item = this.items[index];
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan ini!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3000/items/${item.id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Data berhasil dihapus!',
                showConfirmButton: false,
                timer: 1500
              });
              this.items.splice(index, 1);
            })
            .catch(error => {
              console.error('Error deleting item:', error);
            });
        }
      });
    },
    clearForm() {
      this.newItem = {
        title: '',
        image: '',
        description: ''
      };
    }
  }
};
</script>

<style>
.container {
  max-width: 100%;
  margin: 20px auto;
  margin-top: 80px;
  display: flex;
}

.field label{
  color: white !important;
  font-weight: bold !important;;
}

.Data{
  color: white;
  position: relative;
  margin-left: 10px;
  left:0%;
  top:30%;
  
}
.Data h1{
  color: white;
}

.Input button{
  margin-bottom: 10px;
}
.Kartu{
  margin-top: 50px;
  display: flex;
}
</style>