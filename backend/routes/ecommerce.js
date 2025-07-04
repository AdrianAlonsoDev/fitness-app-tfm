const express = require("express");
const router = express.Router();
const { supabase } = require("../database/supabaseClient");

router.get("/", async (req, res) => {
  try {
    console.log("GET /api/products - Obteniendo todos los productos");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al buscar producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({ name, description, price })
      .eq("id", id)
      .select()
      .single();

    if (!data) return res.status(404).json({ error: "Producto no encontrado" });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("name")
      .single();
    if (!data) return res.status(404).json({ error: "Producto no encontrado" });
    if (error) throw error;
    res.json({
      message: `Producto ${data.name} eliminado correctamente`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
