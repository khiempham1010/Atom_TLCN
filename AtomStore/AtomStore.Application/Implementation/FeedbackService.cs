﻿using AtomStore.Application.Interfaces;
using AtomStore.Application.ViewModels.Common;
using AtomStore.Data.Entities;
using AtomStore.Infrastructure.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AtomStore.Application.Implementation
{
    public class FeedbackService : IFeedbackService
    {
        private IRepository<Feedback, int> _feedbackRepository;
        private IUnitOfWork _unitOfWork;

        public FeedbackService(IRepository<Feedback, int> feedbackRepository,
            IUnitOfWork unitOfWork)
        {
            _feedbackRepository = feedbackRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(FeedbackViewModel feedbackVm)
        {
            var page = Mapper.Map<FeedbackViewModel, Feedback>(feedbackVm);
            _feedbackRepository.Add(page);
        }

        public void Delete(int id)
        {
            _feedbackRepository.Remove(id);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public List<FeedbackViewModel> GetAll()
        {
            return _feedbackRepository.FindAll().ProjectTo<FeedbackViewModel>().ToList();
        }

        //public PagedResult<FeedbackViewModel> GetAllPaging(string keyword, int page, int pageSize)
        //{
        //    var query = _feedbackRepository.FindAll();
        //    if (!string.IsNullOrEmpty(keyword))
        //        query = query.Where(x => x.Name.Contains(keyword));

        //    int totalRow = query.Count();
        //    var data = query.OrderByDescending(x => x.DateCreated)
        //        .Skip((page - 1) * pageSize)
        //        .Take(pageSize);

        //    var paginationSet = new PagedResult<FeedbackViewModel>()
        //    {
        //        Results = data.ProjectTo<FeedbackViewModel>().ToList(),
        //        CurrentPage = page,
        //        RowCount = totalRow,
        //        PageSize = pageSize
        //    };

        //    return paginationSet;
        //}

        public FeedbackViewModel GetById(int id)
        {
            return Mapper.Map<Feedback, FeedbackViewModel>(_feedbackRepository.FindById(id));
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(FeedbackViewModel feedbackVm)
        {
            var page = Mapper.Map<FeedbackViewModel, Feedback>(feedbackVm);
            _feedbackRepository.Update(page);
        }
    }
}
