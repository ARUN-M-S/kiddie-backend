class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const querycopy = { ...this.queryStr };
    // Removing SomeFields From Category

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete querycopy[key]);

    // Filter for Price and rating for that we want to convert the js object to json format for this we usingstringyfy

    let querystr = JSON.stringify(querycopy);

    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(querystr));

    return this;
  }
  pagination(resultPerPage){
       const currentPage = Number(this.queryStr.page) || 1;
       const skip = resultPerPage * (currentPage-1);
       this.query = this.query.limit(resultPerPage).skip(skip);
       return this;
  }
}

module.exports = Apifeatures;
