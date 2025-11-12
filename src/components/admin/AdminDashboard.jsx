// TODO create admin dashboard

import React, {useState, useEffect, useCallback} from "react";
import {fetchCategories, fetchProducts} from '../../api/CategoryApi'
import AddCategoryModal from './AddCategoryModel'
import AddProductModal from "./AddProductModel";

function Admin
