const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;
const BookInstanceSchema = new Schema(
    {
        // reference to the associated book
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        imprint: { type: String, required: true },
        status: { type: String, requred: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
        due_back: { type: Date, default: Date.now }
    }
);

// Virtual for bookinstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function() {
        return `/catalog/bookinstance/${this._id}`;
    });

// Virtual for formatted due date
BookInstanceSchema
    .virtual('due_back_formatted')
    .get(function() {
        return this.due_back ?
            DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
            : '';
    });

BookInstanceSchema
    .virtual('due_back_GET')
    .get(function() {
        return this.due_back ?
            DateTime.fromJSDate(this.due_back).toISODate()
            : '';
    });

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
