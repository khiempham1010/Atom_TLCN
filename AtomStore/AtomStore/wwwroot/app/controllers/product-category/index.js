﻿var productCategoryController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();
    }
    function registerEvents() {
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'en',
            rules: {
                txtNameM: { required: true },
                txtOrderM: { required: true },
                txtOrderM: { number: true },
                txtHomeOrderM: { number: true }
            }
        });

        $('#btnCreate').off('click').on('click', function () {
            initTreeDropDownCategory();
            $('#modal-add-edit').modal('show');
        });
        $('body').on('click', '#btnEdit', function (e) {
            e.preventDefault();
            var that = $('#hidIdM').val();
            $.ajax({
                type: "GET",
                url: "/Admin/ProductCategory/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    atom.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidIdM').val(data.Id);
                    $('#txtNameM').val(data.Name);
                    initTreeDropDownCategory(data.CategoryId);

                    $('#txtDescM').val(data.Description);

                    $('#txtImageM').val(data.ThumbnailImage);

                    $('#txtSeoKeywordM').val(data.SeoKeywords);
                    $('#txtSeoDescriptionM').val(data.SeoDescription);
                    $('#txtSeoPageTitleM').val(data.SeoPageTitle);
                    $('#txtSeoAliasM').val(data.SeoAlias);

                    $('#ckStatusM').prop('checked', data.Status == 1);
                    $('#ckShowHomeM').prop('checked', data.HomeFlag);
                    $('#txtOrderM').val(data.SortOrder);
                    $('#txtHomeOrderM').val(data.HomeOrder);

                    $('#modal-add-edit').modal('show');
                    atom.stopLoading();

                },
                error: function (status) {
                    atom.notify('Có lỗi xảy ra', 'error');
                    atom.stopLoading();
                }
            });
        });

        $('body').on('click', '#btnDelete', function (e) {
            e.preventDefault();
            var that = $('#hidIdM').val();
            atom.confirm('Are you sure to delete?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/ProductCategory/Delete",
                    data: { id: that },
                    dataType: "json",
                    beforeSend: function () {
                        atom.startLoading();
                    },
                    success: function (response) {
                        atom.notify('Deleted success', 'success');
                        atom.stopLoading();
                        loadData();
                    },
                    error: function (status) {
                        atom.notify('Has an error in deleting progress', 'error');
                        atom.stopLoading();
                    }
                });
            });
        });

        $('#btnSave').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = parseInt($('#hidIdM').val());
                var name = $('#txtNameM').val();
                var parentId = $('#ddlCategoryIdM').combotree('getValue');
                var description = $('#txtDescM').val();

                var image = $('#txtImageM').val();
                var order = parseInt($('#txtOrderM').val());
                var homeOrder = $('#txtHomeOrderM').val();

                var seoKeyword = $('#txtSeoKeywordM').val();
                var seoMetaDescription = $('#txtSeoDescriptionM').val();
                var seoPageTitle = $('#txtSeoPageTitleM').val();
                var seoAlias = $('#txtSeoAliasM').val();
                var status = $('#ckStatusM').prop('checked') == true ? 1 : 0;
                var showHome = $('#ckShowHomeM').prop('checked');
                order = id;
                $.ajax({
                    type: "POST",
                    url: "/Admin/ProductCategory/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        Description: description,
                        ParentId: parentId,
                        HomeOrder: homeOrder,
                        SortOrder: order,
                        HomeFlag: showHome,
                        Image: image,
                        Status: status,
                        SeoPageTitle: seoPageTitle,
                        SeoAlias: seoAlias,
                        SeoKeywords: seoKeyword,
                        SeoDescription: seoMetaDescription
                    },
                    dataType: "json",
                    beforeSend: function () {
                        atom.startLoading();
                    },
                    success: function (response) {
                        atom.notify('Update success', 'success');
                        $('#modal-add-edit').modal('hide');

                        resetFormMaintainance();

                        atom.stopLoading();
                        loadData(true);
                    },
                    error: function () {
                        atom.notify('Has an error in update progress', 'error');
                        atom.stopLoading();
                    }
                });
            }
            return false;

        });
    }
    function resetFormMaintainance() {
        $('#hidIdM').val(0);
        $('#txtNameM').val('');
        initTreeDropDownCategory('');

        $('#txtDescM').val('');
        $('#txtOrderM').val('');
        $('#txtHomeOrderM').val('');
        $('#txtImageM').val('');

        $('#txtMetakeywordM').val('');
        $('#txtMetaDescriptionM').val('');
        $('#txtSeoPageTitleM').val('');
        $('#txtSeoAliasM').val('');

        $('#ckStatusM').prop('checked', true);
        $('#ckShowHomeM').prop('checked', false);
    }
    function initTreeDropDownCategory(selectedId) {
        $.ajax({
            url: "/Admin/ProductCategory/GetAll",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (response) {
                var data = [];
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                });
                var arr = atom.unflattern(data);
                $('#ddlCategoryIdM').combotree({
                    data: arr
                });
                if (selectedId != undefined) {
                    $('#ddlCategoryIdM').combotree('setValue', selectedId);
                }
            }
        });
    }
    function loadData() {
        $.ajax({
            url: '/Admin/ProductCategory/GetAll',
            dataType: 'json',
            success: function (response) {
                var data = [];
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                });
                data.sort(function(a, b){return a.SortOrder - b.SortOrder});

                var treeArr = atom.unflattern(data);

                //var $tree = $('#treeProductCategory');
                treeArr.sort(function (a, b) {
                    return a.sortOrder - b.sortOrder;
                })
                $('#treeProductCategory').tree({
                    data: treeArr,
                    dnd: true,
                    onContextMenu: function (e, node) {
                        e.preventDefault();
                        var action = setTimeout(function () {
                            // select the node
                            //$('#tt').tree('select', node.target);
                            $('#hidIdM').val(node.id);
                            // display context menu
                            $('#contextMenu').menu('show', {
                                left: e.pageX,
                                top: e.pageY
                            });
                        }, 50);
                    },
                    onDrop: function (target, source, point) {
                        console.log(target);
                        console.log(source);
                        console.log(point);
                        var targetNode = $(this).tree('getNode', target);
                        if (point === 'append') {
                            var children = [];
                            $.each(targetNode.children, function (i, item) {
                                children.push({
                                    key: item.id,
                                    value: i
                                });
                            });

                            //Update to database
                            $.ajax({
                                url: '/Admin/ProductCategory/UpdateParentId',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id,
                                    items: children
                                },
                                success: function (res) {
                                    loadData();
                                }
                            });
                        }
                        else if (point === 'top' || point === 'bottom') {
                            $.ajax({
                                url: '/Admin/ProductCategory/ReOrder',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id,
                                    point: point
                                },
                                success: function (res) {
                                    loadData();
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}